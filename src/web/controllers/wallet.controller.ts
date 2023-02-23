import { CreateWalletDto, StandardWalletDto } from "../../contracts/dtos";
import { AuthRequiredController, WalletServiceInterface } from "../../contracts/interfaces";
import { ProtectedRouteAccessError } from "../../logic/errors";
import { sendResponse } from "../../utils";
import { BaseController } from "./base.controller";

export class WalletController extends BaseController {
    constructor(private readonly _service: WalletServiceInterface) {
        super();
    }

    createBusinessWallet: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);
            const createWalletDto = new CreateWalletDto(req.body);
            createWalletDto.businessId = req.business.id;
            const wallet = await this._service.createBusinessWallet(createWalletDto);
            const standardWallet = new StandardWalletDto(wallet);
            sendResponse(res, { code: 201, data: { wallet: standardWallet } });
        });
    };
}
