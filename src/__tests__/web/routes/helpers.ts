export const testRoute = (route: string, callback: (route: string) => () => void) => {
    describe(`Testing route ${route}`, callback(route));
};
