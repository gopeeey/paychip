import { AccountServiceInterface, BusinessServiceInterface } from "../../logic";
import { NextFunction, Request, Response } from "express";
import { AccountModelInterface, BusinessModelInterface } from "../../db";

export type AuthType = "account" | "business" | "apiKey";
export type AllowedAuthTypes = AuthType[];
export interface AuthenticatedRequestType extends Request {
    account?: AccountModelInterface;
    business?: BusinessModelInterface;
}

export interface AuthMiddlewareInterface {
    restrictTo: (
        allowedAuth: AllowedAuthTypes
    ) => (req: AuthenticatedRequestType, res: Response, next: NextFunction) => Promise<void>;
}

export interface AuthMiddlewareDependencies {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
}
