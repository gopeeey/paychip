type ConsumerHandlerType = (message: unknown) => Promise<void>;

export interface BaseQueueInterface<M> {
    name: string;
    publish: (message: M) => Promise<void>;
    consume: (callback: ConsumerHandlerType) => void;
}
