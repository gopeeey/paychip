import { AccountServiceInterface, AccountModelInterface } from "@accounts/logic";
import { BusinessServiceInterface, BusinessModelInterface } from "@business/logic";
import { NextFunction, Request, Response } from "express";

export type AuthType = "account" | "business" | "apiKey";
export type AllowedAuthTypes = AuthType[];
export interface AuthenticatedRequestType extends Request {
    account?: AccountModelInterface;
    business?: BusinessModelInterface;
}
export type AuthRequiredController = (
    req: AuthenticatedRequestType,
    res: Response,
    next: NextFunction
) => Promise<void>;

export interface AuthMiddlewareInterface {
    restrictTo: (
        allowedAuth: AllowedAuthTypes
    ) => (req: AuthenticatedRequestType, res: Response, next: NextFunction) => Promise<void>;
}

export interface AuthMiddlewareDependencies {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
}
