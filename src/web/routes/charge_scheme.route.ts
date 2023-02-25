import { ChargeSchemeRouteDependencies } from "../../contracts/interfaces";
import { Router } from "express";
import { ChargeSchemeController } from "../controllers";
import { validateBody } from "../middleware/validation";
import { CreateChargeSchemeValidator } from "../validators";

export class ChargeSchemeRoute {
    constructor(private readonly _deps: ChargeSchemeRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new ChargeSchemeController(this._deps.chargeSchemeService);
        const restrictTo = this._deps.authMiddleware.restrictTo;

        router.post(
            "/create",
            restrictTo(["business", "apiKey"]),
            validateBody(CreateChargeSchemeValidator),
            controller.create
        );

        return router;
    };
}
