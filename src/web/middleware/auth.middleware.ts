import { NextFunction, Request, Response } from "express";
import {
    AuthType,
    AllowedAuthTypes,
    AuthMiddlewareInterface,
    AuthMiddlewareDependencies,
    AuthenticatedRequestType,
} from "./interfaces";
import { UnauthorizedError } from "@logic/base_errors";
import { AccountNotFoundError } from "@logic/accounts";
import { BusinessNotFoundError } from "@logic/business";
import { sendResponse, verifyJwt } from "src/utils";

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
                        try {
                            const account = await this._dependencies.accountService.getById(
                                payload.accountId
                            );
                            if (!account) throw new UnauthorizedError();
                            req.account = account;
                            return next();
                        } catch (err) {
                            if (err instanceof AccountNotFoundError) throw new UnauthorizedError();
                            throw err;
                        }

                    case "business":
                        if (!payload.businessId) throw new UnauthorizedError();
                        try {
                            const business = await this._dependencies.businessService.getById(
                                Number(payload.businessId)
                            );
                            if (!business) throw new UnauthorizedError();
                            req.business = business;
                            return next();
                        } catch (err) {
                            if (err instanceof BusinessNotFoundError) throw new UnauthorizedError();
                            throw err;
                        }
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
