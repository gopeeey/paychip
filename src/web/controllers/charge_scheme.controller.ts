import {
    CreateChargeSchemeDto,
    StandardChargeSchemeDto,
    ChargeSchemeServiceInterface,
} from "@logic/charge_scheme";
import { AuthRequiredController } from "../middleware";
import { ProtectedRouteAccessError } from "../errors";
import { sendResponse } from "src/utils";
import { BaseController } from "./base.controller";

export class ChargeSchemeController extends BaseController {
    constructor(private readonly _service: ChargeSchemeServiceInterface) {
        super();
    }

    create: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);

            const createDto = new CreateChargeSchemeDto({
                ...req.body,
                businessId: req.business.id,
            });
            const data = await this._service.create(createDto);
            const chargeScheme = new StandardChargeSchemeDto(data);
            sendResponse(res, { code: 201, data: { charge: chargeScheme } });
        });
    };
}
