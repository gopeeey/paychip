import { DependencyContainerInterface } from "src/container";
import { Router } from "express";
import AccountRoute from "./account.route";
import { BusinessRoute } from "./buisness.route";
import { WalletRoute } from "./wallet.route";
import { ChargeStackRoute } from "./charge_scheme.route";
import EmptyRoute from "./empty.route";

export class RootRoutes {
    constructor(private readonly _container: DependencyContainerInterface) {}

    init = () => {
        const router = Router();

        const accountRoutes = new AccountRoute(this._container.accountService).init();
        const businessRoutes = new BusinessRoute({
            authMiddleware: this._container.authMiddleware,
            businessService: this._container.businessService,
        }).init();
        const walletRoutes = new WalletRoute({
            authMiddleware: this._container.authMiddleware,
            walletService: this._container.walletService,
        }).init();
        const chargeStackRoutes = new ChargeStackRoute({
            authMiddleware: this._container.authMiddleware,
            chargeStackService: this._container.chargeStackService,
        }).init();

        router.use("/account", accountRoutes);
        router.use("/business", businessRoutes);
        router.use("/wallet", walletRoutes);
        router.use("/charges", chargeStackRoutes);

        // These are just empty, they make unit testing the auth middleware easier
        if (this._container.authMiddleware) {
            const emptyRoutes = new EmptyRoute(this._container.authMiddleware).init();
            router.use("/empty", emptyRoutes);
        }

        return router;
    };
}
