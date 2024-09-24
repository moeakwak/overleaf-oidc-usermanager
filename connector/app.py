import os
import re
import docker
from fastapi import FastAPI, Depends, HTTPException, status
from dotenv import load_dotenv
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi import Header

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "sharelatex")
CONTAINER_NAME = os.getenv("CONTAINER_NAME", "sharelatex")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 4571))
AUTH_TOKEN = os.getenv("AUTH_TOKEN")

if not AUTH_TOKEN:
    raise ValueError("AUTH_TOKEN environment variable cannot be empty")

app = FastAPI()

client = MongoClient(MONGO_URL, connect=True, connectTimeoutMS=3000)

db = client[MONGO_DB_NAME]
users_collection = db["users"]


def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization.split(" ")[1]


class UserModel(BaseModel):
    _id: str
    email: str
    first_name: str | None = None
    last_name: str | None = None
    is_admin: bool = False
    # hashedPassword: str | None = None

    class Config:
        from_attributes = True


def get_current_user(token: str = Depends(verify_token)):
    if token != AUTH_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )


class CreateUserRequest(BaseModel):
    email: str
    admin: bool = False


class CreateUserResponse(BaseModel):
    message: str


@app.get("/list-users", dependencies=[Depends(get_current_user)], response_model=list[UserModel])
async def get_users():
    users = list(users_collection.find())
    return users


@app.get("/get-user", dependencies=[Depends(get_current_user)], response_model=UserModel)
async def get_user_by_email(email: str):
    user = users_collection.find_one({"email": email})
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")


@app.post("/create-user", dependencies=[Depends(get_current_user)], response_model=CreateUserResponse)
async def create_user(req: CreateUserRequest):
    email = req.email
    admin = req.admin
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
        raise HTTPException(status_code=400, detail="Invalid email")

    try:
        client = docker.from_env()
        container = client.containers.get(CONTAINER_NAME)
        result = container.exec_run(
            f"/bin/bash -ce 'cd /overleaf/services/web && node modules/server-ce-scripts/scripts/create-user --email={email}'"
            + (f" --admin" if admin else ""),
            stdout=True,
            stderr=True,
        )
        if result.exit_code == 0:
            return {"message": result.output.decode().strip()}
        else:
            raise HTTPException(status_code=500, detail=result.output.decode().strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    print(f"AUTH_TOKEN: {AUTH_TOKEN}")

    uvicorn.run(app, host=HOST, port=PORT)
