import { AccountServiceInterface } from "../../contracts/interfaces/logic_web";
import { NextFunction, Request, Response } from "express";
import BaseController from "./base.controller";
import { CreateAccountDto, LoginDto } from "../../contracts/dtos";
import { sendResponse } from "../../utils/functions";

export class AccountController extends BaseController {
    constructor(private readonly _service: AccountServiceInterface) {
        super();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const createAccountDto = new CreateAccountDto(req.body as CreateAccountDto);
            const resData = await this._service.signup(new CreateAccountDto(createAccountDto));
            sendResponse(res, { code: 201, data: resData });
        });
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const loginDto = new LoginDto(req.body as LoginDto);
            const resData = await this._service.login(loginDto);
            sendResponse(res, { code: 200, data: resData });
        });
    };
}
