import { DependencyContainerInterface } from "../../contracts/interfaces";
import { Router } from "express";
import AccountRoute from "./account.route";
import { BusinessRoute } from "./buisness.route";
import EmptyRoute from "./empty.route";

export class RootRoutes {
    constructor(private readonly _container: DependencyContainerInterface) {}

    init() {
        const router = Router();

        const accountRoutes = new AccountRoute(this._container.accountService).init();
        const businessRoutes = new BusinessRoute({
            authMiddleware: this._container.authMiddleware,
            businessService: this._container.businessService,
        }).init();

        router.use("/account", accountRoutes);
        router.use("/business", businessRoutes);

        // These are just empty, they make unit testing the auth middleware easier
        if (this._container.authMiddleware) {
            const emptyRoutes = new EmptyRoute(this._container.authMiddleware).init();
            router.use("/empty", emptyRoutes);
        }

        return router;
    }
}
