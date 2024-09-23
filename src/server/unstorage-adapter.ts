// https://github.com/shinosaki/lucia-adapter-unstorage

import type { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import { prefixStorage, Storage } from "unstorage";

export class UnstorageAdapter implements Adapter {
  private sessionStorage;
  private userStorage;

  constructor(sessionStorage: Storage<DatabaseSession>, userStorage: Storage<DatabaseUser>) {
    this.sessionStorage = sessionStorage;
    this.userStorage = userStorage;
  }

  public async setSession(session: DatabaseSession): Promise<void> {
    // console.log("adapter:setSession", session);
    await this.sessionStorage.setItem(session.id, session);
  }

  public async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    const keys = await this.sessionStorage.getKeys(userId);
    const sessions = await Promise.all(
      keys.map((key) =>
        this.sessionStorage.getItem(key).then((session) => {
          if (!session) return null;
          if (session.userId !== userId) return null;
          session.expiresAt = new Date(session.expiresAt);
          return session;
        }),
      ),
    );
    return sessions.filter((session) => session !== null) as DatabaseSession[];
  }

  public async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const key = await this.getSessionKeyWithSessionId(sessionId);
    const session = key && (await this.sessionStorage.getItem(key));
    if (!session) return [null, null];

    session.expiresAt = new Date(session.expiresAt);
    const user = await this.userStorage.getItem(session.userId);
    return [session, user];
  }

  public async deleteSession(sessionId: string): Promise<void> {
    const key = await this.getSessionKeyWithSessionId(sessionId);
    if (!key) return;
    await this.sessionStorage.removeItem(key);
  }

  public async deleteUserSessions(userId: string): Promise<void> {
    const keys = await this.sessionStorage.getKeys(userId);
    await Promise.all(keys.map((key) => this.sessionStorage.removeItem(key)));
  }

  public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    const key = await this.getSessionKeyWithSessionId(sessionId);
    if (!key) return;
    const session = await this.sessionStorage.getItem(key);
    if (!session) return;
    session.expiresAt = expiresAt;
    await this.sessionStorage.setItem(key, session);
  }

  public async deleteExpiredSessions(): Promise<void> {
    const keys = await this.sessionStorage.getKeys();
    for (const key of keys) {
      const session = await this.sessionStorage.getItem(key);
      if (session && new Date(session.expiresAt) <= new Date()) {
        await this.sessionStorage.removeItem(key);
      }
    }
  }

  private async getSessionKeyWithSessionId(sessionId: string): Promise<string | null> {
    const keys = await this.sessionStorage.getKeys();
    // console.log("keys", keys);
    return keys.find((key) => key.includes(sessionId)) ?? null;
  }
}
