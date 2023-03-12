import {
    CreateChargeStackDto,
    StandardChargeStackDto,
    ChargeStackServiceInterface,
} from "@logic/charges";
import { AuthRequiredController } from "../middleware";
import { ProtectedRouteAccessError } from "../errors";
import { sendResponse } from "src/utils";
import { BaseController } from "./base.controller";

export class ChargeStackController extends BaseController {
    constructor(private readonly _service: ChargeStackServiceInterface) {
        super();
    }

    create: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);

            const createDto = new CreateChargeStackDto({
                ...req.body,
                businessId: req.business.id,
            });
            const data = await this._service.create(createDto);
            const chargeStack = new StandardChargeStackDto(data);
            sendResponse(res, { code: 201, data: { charge: chargeStack } });
        });
    };
}
