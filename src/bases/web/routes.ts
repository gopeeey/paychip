import { DependencyContainerInterface } from "src/container";
import { Router } from "express";
import { AccountRoute } from "@accounts/web";
import { BusinessRoute } from "@business/web";
import { WalletRoute } from "@wallet/web";
import { ChargesRoute } from "@charges/web";
import { WebhookRoute } from "./webhooks/routes";
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

        const ChargesRoutes = new ChargesRoute({
            authMiddleware: this._container.authMiddleware,
            chargesService: this._container.chargesService,
        }).init();

        const webhookRoutes = new WebhookRoute({
            publishTransactionTask: this._container.publishTransactionTask,
            publishTransferVerificationTask: this._container.publishTransferVerificationTask,
        }).init();

        router.use("/account", accountRoutes);
        router.use("/business", businessRoutes);
        router.use("/wallet", walletRoutes);
        router.use("/charges", ChargesRoutes);
        router.use("/webhooks", webhookRoutes);

        // These are just empty, they make unit testing the auth middleware easier
        if (this._container.authMiddleware) {
            const emptyRoutes = new EmptyRoute(this._container.authMiddleware).init();
            router.use("/empty", emptyRoutes);
        }

        return router;
    };
}
