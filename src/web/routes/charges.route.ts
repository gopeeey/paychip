import { ChargeStackRouteDependencies } from "./interfaces";
import { Router } from "express";
import { ChargeStackController } from "../controllers";
import { validateBody } from "../middleware/validation";
import * as validators from "../validators";

export class ChargesRoute {
    constructor(private readonly _deps: ChargeStackRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new ChargeStackController(this._deps.chargesService);
        const restrictTo = this._deps.authMiddleware.restrictTo;

        // CHARGE STACKS
        router.post(
            "/stacks",
            restrictTo(["business"]),
            validateBody(validators.CreateChargeStackValidator),
            controller.create_charge_stack
        );

        router.post(
            "/stacks/add-to-wallet",
            restrictTo(["business"]),
            validateBody(validators.AddStackToWalletValidator),
            controller.add_stack_to_wallet
        );

        return router;
    };
}
