import { AccountServiceInterface, AccountModelInterface } from "@logic/accounts";
import { BusinessServiceInterface, BusinessModelInterface } from "@logic/business";
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
