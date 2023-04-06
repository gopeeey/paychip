import {
    CreateChargeStackDto,
    StandardChargeStackDto,
    ChargesServiceInterface,
    CreateChargeDto,
    StandardChargeDto,
    AddChargesToStackDto,
    AddChargeStackToWalletDto,
} from "@logic/charges";
import { AuthRequiredController } from "../middleware";
import { ProtectedRouteAccessError } from "../errors";
import { sendResponse, validateBusinessObjectId } from "src/utils";
import { BaseController } from "./base.controller";

export class ChargeStackController extends BaseController {
    constructor(private readonly _service: ChargesServiceInterface) {
        super();
    }

    create_charge_stack: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);

            const createDto = new CreateChargeStackDto({
                ...req.body,
                businessId: req.business.id,
            });
            const data = await this._service.createStack(createDto);
            const chargeStack = new StandardChargeStackDto(data);
            sendResponse(res, { code: 201, data: { chargeStack } });
        });
    };

    create_charge: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);
            const data = new CreateChargeDto({ ...req.body, businessId: req.business.id });
            const charge = await this._service.createCharge(data);
            const standardCharge = new StandardChargeDto(charge);

            sendResponse(res, {
                code: 201,
                data: { charge: standardCharge },
            });
        });
    };

    add_charges_to_stack: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);

            const data = new AddChargesToStackDto(req.body);
            const objectIds = [...data.chargeIds, data.stackId];

            validateBusinessObjectId(objectIds, req.business.id);

            const stack = await this._service.addChargesToStack(data);
            const standardStack = new StandardChargeStackDto(stack);

            sendResponse(res, { code: 200, data: { chargeStack: standardStack } });
        });
    };

    add_stack_to_wallet: AuthRequiredController = async (req, res, next) => {
        this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);

            const data = new AddChargeStackToWalletDto({ ...req.body });
            validateBusinessObjectId([data.walletId, data.chargeStackId], req.business.id);
            await this._service.addStackToWallet(data);

            sendResponse(res, { code: 200 });
        });
    };
}
