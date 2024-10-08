import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);
export const UserRoles = UserRoleSchema.Values;
export type UserRole = z.infer<typeof UserRoleSchema>;

export const AdminUserLoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
