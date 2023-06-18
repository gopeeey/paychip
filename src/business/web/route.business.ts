import { Router } from "express";
import { BusinessController } from "./controller.business";
import { validateBody } from "@bases/web";
import { CreateBusinessValidator } from "./validators";
import { BusinessServiceInterface } from "@business/logic";
import { AuthMiddlewareInterface } from "@bases/web";

export interface BusinessRouteDependencies {
    businessService: BusinessServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}

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
