import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/connector/client";
import { getCurrentUserOrRedirect } from "@/lib/session";
import { RegisterButton } from "./register-button";
import LogoutButton from "../_components/logout-button";

export default async function DashboardPage({}) {
  const user = await getCurrentUserOrRedirect();
  const overleafUser = await getUser(user.email);

  return (
    <div className="mx-4 mt-4 flex min-h-[calc(100vh-100px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
          Overleaf User Status
          <LogoutButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Your email: <span className="font-bold">{user.email}</span>
          </p>
          <p className="mb-2">
            Your Overleaf account:
            <span className={`ml-2 font-bold ${overleafUser ? "text-green-500" : "text-gray-500"}`}>
              {overleafUser ? "Registered" : "Not Registered"}
            </span>
            {overleafUser ? <span className="ml-1 text-gray-500">({overleafUser.is_admin ? "admin" : "user"})</span> : null}
          </p>

          {overleafUser ? <p>Overleaf email: <span className="font-bold">{overleafUser.email}</span></p> : null}

          <div className="mt-4 w-full">
            <RegisterButton email={user.email} text="Create Account" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
