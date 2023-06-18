import { AuthMiddleware, AuthMiddlewareDependencies } from "@bases/web";
import { accountJson, businessJson } from "src/__tests__/helpers/samples";

export const getMiddlewareMocks = () => {
    const businessService = { getById: jest.fn() };
    const accountService = { getById: jest.fn() };

    const authMiddleware = new AuthMiddleware({
        businessService,
        accountService,
    } as unknown as AuthMiddlewareDependencies);

    return { authMiddleware, businessService, accountService };
};

type testRouteOpts = {
    middlewareDeps?: {
        business: { getById: jest.Mock };
        account: { getById: jest.Mock };
    };
};
export const testRoute = (
    route: string,
    callback: (route: string, mockMiddleware?: (() => void) | undefined) => () => void,
    opts?: testRouteOpts
) => {
    var mockMiddleware = undefined;
    if (opts?.middlewareDeps) {
        mockMiddleware = () => {
            opts.middlewareDeps?.account.getById.mockResolvedValue(accountJson);
            opts.middlewareDeps?.business.getById.mockResolvedValue(businessJson);
        };
    }
    describe(`>>> ${route}`, callback(route, mockMiddleware));
};
