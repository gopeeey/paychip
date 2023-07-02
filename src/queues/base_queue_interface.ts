type ConsumerHandlerType<M> = (message: M) => Promise<void>;

export interface BaseQueueInterface<M> {
    name: string;
    publish: (message: M) => Promise<void>;
    consume: (callback: ConsumerHandlerType<M>) => void;
}
