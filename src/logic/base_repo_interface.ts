import { SessionInterface } from "./session_interface";

export interface BaseRepoInterface {
    startSession: () => Promise<SessionInterface>;
}
