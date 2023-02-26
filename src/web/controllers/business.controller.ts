import { BaseController } from "./base.controller";
import { AuthRequiredController } from "../middleware";
import { BusinessServiceInterface, CreateBusinessDto, StandardBusinessDto } from "@logic/business";
import { sendResponse } from "src/utils";
import { ProtectedRouteAccessError } from "../errors";

export class BusinessController extends BaseController {
    constructor(private readonly _service: BusinessServiceInterface) {
        super();
    }

    create: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.account) throw new ProtectedRouteAccessError(req.path);
            const createBusinessDto = { ...req.body, ownerId: req.account.id };
            const data = await this._service.createBusiness(
                new CreateBusinessDto(createBusinessDto as CreateBusinessDto)
            );

            const business = new StandardBusinessDto(data);

            sendResponse(res, { code: 201, data: { business } });
        });
    };

    getOwnerBusinesses: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.account) throw new ProtectedRouteAccessError(req.path);
            const data = await this._service.getOwnerBusinesses(req.account.id);
            const businesses = data.map((business) => new StandardBusinessDto(business));

            sendResponse(res, { code: 200, data: { businesses } });
        });
    };

    businessLogin: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.account) throw new ProtectedRouteAccessError(req.path);
            const accessToken = await this._service.getBusinessAccessToken(
                Number(req.params.businessId),
                req.account.id
            );

            sendResponse(res, { code: 200, data: { accessToken } });
        });
    };
}
