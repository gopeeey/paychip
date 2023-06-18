export interface SessionInterface {
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
    ended: boolean;
}

export type StartSessionType = () => Promise<SessionInterface>;
