import { BaseController } from "./base.controller";
import { AuthenticatedRequestType, BusinessServiceInterface } from "../../contracts/interfaces";
import { NextFunction, Response } from "express";
import { CreateBusinessDto, StandardBusinessDto } from "../../contracts/dtos";
import { sendResponse } from "../../utils/functions";
import { ProtectedRouteAccessError } from "../../logic/errors";

export class BusinessController extends BaseController {
    constructor(private readonly _service: BusinessServiceInterface) {
        super();
    }

    create = async (req: AuthenticatedRequestType, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            if (!req.account) throw new ProtectedRouteAccessError(req.path);
            const createBusinessDto = { ...req.body, ownerId: req.account.id };
            console.log("\n\nFROM CONTROLLER", this._service);
            const data = await this._service.createBusiness(
                new CreateBusinessDto(createBusinessDto as CreateBusinessDto)
            );

            const business = new StandardBusinessDto(data);

            sendResponse(res, { code: 201, data: { business } });
        });
    };

    getOwnerBusinesses = async (
        req: AuthenticatedRequestType,
        res: Response,
        next: NextFunction
    ) => {
        await this.handleReq(next, async () => {
            if (!req.account) throw new ProtectedRouteAccessError(req.path);
            const data = await this._service.getOwnerBusinesses(req.account.id);
            const businesses = data.map((business) => new StandardBusinessDto(business));

            sendResponse(res, { code: 200, data: { businesses } });
        });
    };
}
