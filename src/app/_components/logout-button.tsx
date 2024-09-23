"use client";

import { useLogout } from "@/hooks/logout";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const logout = useLogout();

  return <Button onClick={logout} variant="outline">Logout</Button>; 
}
