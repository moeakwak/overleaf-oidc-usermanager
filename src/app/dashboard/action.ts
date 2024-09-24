"use server";

import { createUser } from "@/connector/client";

export async function doCreateUser(email: string, isAdmin: boolean) {
  const data = await createUser({ email, isAdmin });
  if (data.message) {
    return data.message;
  }
  return null;
}
