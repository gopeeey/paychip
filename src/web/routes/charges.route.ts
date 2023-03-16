import { ChargeStackRouteDependencies } from "./interfaces";
import { Router } from "express";
import { ChargeStackController } from "../controllers";
import { validateBody } from "../middleware/validation";
import { CreateChargeStackValidator } from "../validators";

export class ChargesRoute {
    constructor(private readonly _deps: ChargeStackRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new ChargeStackController(this._deps.chargesService);
        const restrictTo = this._deps.authMiddleware.restrictTo;

        router.post(
            "/stacks/create",
            restrictTo(["business", "apiKey"]),
            validateBody(CreateChargeStackValidator),
            controller.create_charge_stack
        );

        return router;
    };
}
