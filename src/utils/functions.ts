import bcrypt from "bcrypt";
import config from "../config";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { Response } from "express";
import { AccountModelInterface } from "@accounts/logic";
import { BusinessModelInterface } from "@business/logic";
import { PermissionDeniedError } from "@bases/logic";

export const hashString = async (string: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(string, salt);
    return hash;
};

export const generateJwt = (
    payload: { [key: string]: any } | string,
    secret: string = config.misc.jwtSecret
) => {
    const token = jwt.sign(payload, secret);
    return token;
};

export const generateAuthToken = (
    authType: "account" | "business",
    payload: { accountId?: AccountModelInterface["id"]; businessId?: BusinessModelInterface["id"] }
) => {
    if (!payload.accountId || !payload.accountId?.length)
        throw new Error(`accountId is required for authType ${authType}`);
    switch (authType) {
        case "account":
            break;
        case "business":
            if (!payload.businessId)
                throw new Error("businessId is required for authType business");
            break;
        default:
            throw new Error("Invalid authentication type");
    }

    return generateJwt({
        authType,
        ...payload,
    });
};

export const verifyJwt = <T>(token: string, secret: string = config.misc.jwtSecret) => {
    const result = jwt.verify(token, secret) as T;
    return result;
};

export const sendResponse = (
    res: Response,
    opts: { code: number; message?: string; data?: any }
) => {
    let defaultOpts = { code: 200, message: "successful" };
    opts = { ...defaultOpts, ...opts };

    res.status(opts.code).json({
        message: opts.message,
        data: opts.data,
    });
};

export const generateId = (suffix?: number | string) => {
    const id = nanoid();
    return id + (suffix ? suffix?.toString() : "");
};

export const validateBusinessObjectId = (strings: string[], businessId: number) => {
    const valid = strings.every((str) => str.endsWith(businessId.toString()));
    if (!valid) throw new PermissionDeniedError();
};

export const encodeHex = (str: string) => Buffer.from(str).toString("hex");

export const decodeHex = (hex: string) => Buffer.from(hex, "hex").toString();
