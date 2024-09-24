import { Lucia, type Session as LuciaSession, TimeSpan, type User } from "lucia";

import { UnstorageAdapter } from "./unstorage-adapter";
import { userStorage, sessionStorage } from "./db";
import { type UserRole } from "./schema";

const adapter = new UnstorageAdapter(sessionStorage, userStorage);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "h"),
  sessionCookie: {
    name: "overleaf-mgr-session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
    };
  },
  getSessionAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }

  interface DatabaseUserAttributes {
    email: string;
    role: UserRole;
  }

  interface DatabaseSessionAttributes {
    email: string;
    role: UserRole;
  }
}

export type SessionUser = User;

export interface SessionData extends LuciaSession {
  userAttr: SessionUser;
}
