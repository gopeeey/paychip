type SpiesObj<T> = { [Key in keyof T]: jest.SpiedFunction<(...args: any) => any> };
export const createSpies = <T extends {}>(theClass: T) => {
    let spies: SpiesObj<T> = {} as SpiesObj<T>;

    for (let key in theClass) {
        const theKey = key as unknown as keyof jest.ConstructorProperties<Required<T>>;
        spies[key] = jest.spyOn(theClass, theKey);
    }

    return spies;
};
