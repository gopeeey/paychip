import { NextFunction, Request, Response } from "express";
import { AccountServiceInterface, BusinessServiceInterface } from "../../contracts/interfaces";
import { UnauthorizedError } from "../../logic/errors";
import { sendResponse, verifyJwt } from "../../utils/functions";

type AuthType = "account" | "business" | "apiKey";
export class AuthMiddleware {
    constructor(
        private readonly _accountService: AccountServiceInterface,
        private readonly _businessService: BusinessServiceInterface
    ) {}

    validate = (authType: AuthType) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authToken = req.body.authToken as string | undefined;
            if (!authToken) throw new UnauthorizedError();
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                sendResponse(res, { code: 401, message: err.message });
            } else {
                // this definitely could be better
                console.log(err);
            }
            return;
        }
    };
}
