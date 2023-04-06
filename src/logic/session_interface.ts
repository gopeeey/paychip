export interface SessionInterface {
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
}

export type StartSessionType = () => Promise<SessionInterface>;
