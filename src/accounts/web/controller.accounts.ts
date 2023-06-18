import { NextFunction, Request, Response } from "express";
import { BaseController } from "@bases/web";
import {
    CreateAccountDto,
    LoginDto,
    StandardAccountDto,
    AccountServiceInterface,
} from "@accounts/logic";
import { sendResponse } from "src/utils";

export class AccountController extends BaseController {
    constructor(private readonly _service: AccountServiceInterface) {
        super();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const createAccountDto = new CreateAccountDto(req.body as CreateAccountDto);
            const resData = await this._service.signup(new CreateAccountDto(createAccountDto));

            const data = {
                account: new StandardAccountDto(resData.account),
                authToken: resData.authToken,
            };
            sendResponse(res, { code: 201, data });
        });
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const loginDto = new LoginDto(req.body as LoginDto);
            const resData = await this._service.login(loginDto);

            const data = {
                account: new StandardAccountDto(resData.account),
                authToken: resData.authToken,
            };
            sendResponse(res, { code: 200, data });
        });
    };
}
