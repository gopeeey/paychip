type standardOmits = "updatedAt" | "deletedAt";
export type StandardDtoType<
    ModelInterface,
    prop extends keyof Omit<ModelInterface, standardOmits> = any
> = Omit<ModelInterface, standardOmits | prop>;

export interface BaseModelInterface {
    createdAt?: string;
    // updatedAt?: Date;
    // deletedAt?: Date | null;
}

export type PickWithOptional<T, K extends keyof T, O extends keyof T = any> = Pick<T, K> &
    Partial<Pick<T, O>>;
