import { Router } from "express";
import { BusinessRouteDependencies } from "../../contracts/interfaces";
import { BusinessController } from "../controllers";
import { validateBody } from "../middleware/validation";
import { CreateBusinessValidator } from "../validators";

export class BusinessRoute {
    constructor(private readonly _dependencies: BusinessRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new BusinessController(this._dependencies.businessService);
        const restrictTo = this._dependencies.authMiddleware.restrictTo;

        router.post(
            "/create",
            restrictTo(["account"]),
            validateBody(CreateBusinessValidator),
            controller.create
        );

        router.get("/owner", restrictTo(["account"]), controller.getOwnerBusinesses);

        router.get("/login/:businessId", restrictTo(["account"]), controller.businessLogin);

        return router;
    };
}
