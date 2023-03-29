type SpiesObj<M extends string> = { [Key in M]: jest.SpiedFunction<(...args: any) => any> };
export const createClassSpies = <T extends {}, K extends Extract<keyof T, string>[]>(
    theClass: T,
    methods: K
) => {
    let spies: SpiesObj<K[number]> = {} as SpiesObj<K[number]>;

    for (let key of methods) {
        const theKey = key as unknown as keyof jest.ConstructorProperties<Required<T>>;
        if (typeof theClass[theKey] === "function") spies[key] = jest.spyOn(theClass, theKey);
    }

    return spies;
};
