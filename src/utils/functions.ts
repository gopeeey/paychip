import bcrypt from "bcrypt";
import config from "../config";
import jwt from "jsonwebtoken";
import { Response } from "express";

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
    authType: "user" | "business",
    payload: { userId?: string; businessId?: string }
) => {
    if (!payload.userId || !payload.userId?.length)
        throw new Error(`userId is required for authType ${authType}`);
    switch (authType) {
        case "user":
            break;
        case "business":
            if (!payload.businessId || !payload.businessId?.length)
                throw new Error("businessId is required for authType business");
            break;
        default:
            throw new Error("Invalid authentication type");
    }

    return generateJwt({
        authType,
        data: payload,
    });
};

export const sendResponse = (
    res: Response,
    opts: { code: number; message?: string; data?: object } = {
        code: 200,
        message: "successful",
    }
) => {
    res.status(opts.code).json({
        message: opts.message,
        data: opts.data,
    });
};
