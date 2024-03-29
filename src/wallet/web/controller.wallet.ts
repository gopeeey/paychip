import {
    CreateWalletDto,
    InitializeFundingDto,
    StandardWalletDto,
    WalletServiceInterface,
} from "@wallet/logic";
import { AuthRequiredController, ProtectedRouteAccessError, BaseController } from "@bases/web";
import { sendResponse } from "src/utils";

export class WalletController extends BaseController {
    constructor(private readonly _service: WalletServiceInterface) {
        super();
    }

    createWallet: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);
            const createWalletDto = new CreateWalletDto(req.body);
            createWalletDto.businessId = req.business.id;
            const wallet = await this._service.createWallet(createWalletDto);
            const standardWallet = new StandardWalletDto(wallet);
            sendResponse(res, { code: 201, data: { wallet: standardWallet } });
        });
    };

    getFundingLink: AuthRequiredController = async (req, res, next) => {
        await this.handleReq(next, async () => {
            if (!req.business) throw new ProtectedRouteAccessError(req.path);
            const initializeFundingDto = new InitializeFundingDto({
                ...req.body,
                businessId: req.business.id,
            });
            const link = await this._service.initializeFunding(initializeFundingDto);
            sendResponse(res, { code: 200, data: { fundingLink: link } });
        });
    };
}
