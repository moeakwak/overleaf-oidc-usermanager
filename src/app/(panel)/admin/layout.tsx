import { getSessionUserAttrOrRedirect } from "@/lib/session";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import LogoutButton from "../../_components/logout-button";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getSessionUserAttrOrRedirect();
  if (user.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-[1000px] items-center justify-between py-4">
          <div className={cn("flex gap-6 md:gap-10")}>
            <span className="hidden sm:inline-block">{env.SITE_NAME} Admin</span>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div>{user.email}</div>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="px-4> mx-auto grid w-full max-w-[1000px] gap-12">{children}</div>
    </>
  );
}
