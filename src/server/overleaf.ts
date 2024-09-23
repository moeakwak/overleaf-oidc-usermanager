import { env } from "@/env";
import { MongoClient } from "mongodb";
import { z } from "zod";

const client = new MongoClient(env.MONGO_URL);
await client.connect();

const db = client.db(env.MONGO_DB_NAME);
const usersCollection = db.collection("users");

// 定义 Zod schema
const userSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  isAdmin: z.boolean(),
  signUpDate: z.string().optional(),
  lastLoggedIn: z.string().optional(),
});

export async function getAllOverleafUsers() {
  const users = await usersCollection.find().toArray();
  return users.map((user) => userSchema.parse(user));
}

export async function getOverleafUserByEmail(email: string) {
  const user = await usersCollection.findOne({ email });
  return user ? userSchema.parse(user) : null;
}
