// In Memory Data Store Interface
export interface ImdsInterface {
    lock: (value: string, seconds: number) => Promise<boolean>;
    release: (value: string) => Promise<void>;
}
