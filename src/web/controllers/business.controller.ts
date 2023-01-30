import { BaseController } from "./base.controller";
import { AuthenticatedRequestType, BusinessServiceInterface } from "../../contracts/interfaces";
import { NextFunction, Response } from "express";
import { CreateBusinessDto } from "../../contracts/dtos";
import { sendResponse } from "../../utils/functions";

export class BusinessController extends BaseController {
    constructor(private readonly _service: BusinessServiceInterface) {
        super();
    }

    create = async (req: AuthenticatedRequestType, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const business = await this._service.createBusiness(
                new CreateBusinessDto(req.body as CreateBusinessDto)
            );
            sendResponse(res, { code: 201, data: { business } });
        });
    };
}
