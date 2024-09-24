import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser, createUser } from "@/connector/client";
import { getCurrentUserOrRedirect } from "@/lib/session";
import { RegisterButton } from "../../_components/register-button";
import { Button } from "@/components/ui/button";

export default async function DashboardPage({}) {
  const user = await getCurrentUserOrRedirect();
  const overleafUser = await getUser(user.email);

  return (
    <div className="mx-4 mt-4 flex min-h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Create a new admin</Button>
        </CardContent>
      </Card>
    </div>
  );
}
