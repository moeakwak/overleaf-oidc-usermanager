import { getCurrentUserOrRedirect } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage({}) {
  const user = await getCurrentUserOrRedirect();

  // if (user.role === "ADMIN") {
  //   return redirect("/admin");
  // }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
