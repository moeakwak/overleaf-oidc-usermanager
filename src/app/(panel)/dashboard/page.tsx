import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser, createUser } from "@/connector/client";
import { getCurrentUserOrRedirect } from "@/lib/session";
import { RegisterButton } from "../../_components/register-button";

export default async function DashboardPage({}) {
  const user = await getCurrentUserOrRedirect();
  const overleafUser = await getUser(user.email);

  return (
    <div className="mx-4 mt-4 flex min-h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Overleaf User Status</CardTitle>
        </CardHeader>
        <CardContent>
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
