// db.ts
import { UserRole } from "./schema";
import { createStorage, prefixStorage } from "unstorage";

import fsLiteDriver from "unstorage/drivers/fs-lite";
const storage = createStorage({
  driver: fsLiteDriver({ base: "./tmp" }),
});
export const userStorage = prefixStorage<DatabaseUser>(storage, "user");
export const sessionStorage = prefixStorage(storage, "session");

export interface DatabaseUser {
  id: string;
  attributes: {
    email: string;
    role: UserRole;
  };
}
