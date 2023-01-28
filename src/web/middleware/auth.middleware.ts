import { NextFunction, Request, Response } from "express";
import {
    AccountServiceInterface,
    BusinessServiceInterface,
    AuthType,
    AllowedAuthTypes,
    AuthMiddlewareInterface,
    AuthMiddlewareDependencies,
    AuthenticatedRequestType,
} from "../../contracts/interfaces";
import { UnauthorizedError } from "../../logic/errors";
import { sendResponse, verifyJwt } from "../../utils/functions";

type JwtPayloadType = { accountId?: string; businessId?: string; aid?: string; authType: AuthType };

export class AuthMiddleware implements AuthMiddlewareInterface {
    constructor(private readonly _dependencies: AuthMiddlewareDependencies) {}

    restrictTo =
        (allowedAuth: AllowedAuthTypes) =>
        async (req: AuthenticatedRequestType, res: Response, next: NextFunction) => {
            try {
                const rawToken = req.headers.authorization as string | undefined;
                if (!rawToken) throw new UnauthorizedError();
                const authToken = rawToken.split("Bearer ")[1];
                if (!authToken) throw new UnauthorizedError();

                const payload = verifyJwt<JwtPayloadType>(authToken);

                if (!allowedAuth.includes(payload.authType)) throw new UnauthorizedError();

                switch (payload.authType) {
                    case "account":
                        if (!payload.accountId) throw new UnauthorizedError();
                        const account = await this._dependencies.accountService.getById(
                            payload.accountId
                        );
                        if (!account) throw new UnauthorizedError();
                        req.account = account;
                        return next();
                        break;
                    case "business":
                        // if (!payload.businessId) throw new UnauthorizedError();
                        // const business = await this._dependencies.businessService.getById(
                        //     payload.accountId
                        // );
                        // if (!account) throw new UnauthorizedError();
                        // req.account = account;
                        // return next();
                        break;
                    case "apiKey":
                        break;
                    default:
                        throw new UnauthorizedError();
                }
            } catch (err) {
                let message = "Unauthorized";

                if (err instanceof UnauthorizedError) message = err.message;

                sendResponse(res, { code: 401, message });

                // This definitely could be improved with a logging service like sentry
                if (!(err instanceof UnauthorizedError))
                    console.log("\n\nFROM AUTH MIDDLEWARE", err);

                return;
            }
        };
}
