import {
    CreateChargeStackDto,
    StandardChargeStackDto,
    ChargesServiceInterface,
    AddChargeStackToWalletDto,
} from "@logic/charges";
import { AuthRequiredController, BaseController, ProtectedRouteAccessError } from "@bases/web";
import { sendResponse, validateBusinessObjectId } from "src/utils";

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
