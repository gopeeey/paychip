// In Memory Data Store Interface
export interface ImdsInterface {
    lock: (value: string, seconds: number) => Promise<string | null>;
    release: (value: string, lock: string) => Promise<boolean>;
}
