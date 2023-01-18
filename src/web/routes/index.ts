import { DependencyContainerInterface } from "../../d_container";
import { Router } from "express";
import AccountRoute from "./account.route";

export default class Routes {
    constructor(private readonly _container: DependencyContainerInterface) {}

    init() {
        const router = Router();

        const accountRoutes = new AccountRoute(this._container.accountService).init();
        router.use("/account", accountRoutes);

        return router;
    }
}
