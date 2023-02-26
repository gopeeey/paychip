import { Request, Response, NextFunction } from "express";
import { sendResponse } from "src/utils";
import { NotFoundError, ValidationError, UnauthorizedError, BaseError } from "@logic/base_errors";

export const errorHandler = async (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!error || !(error instanceof Error)) return next(error);
    let message: string | undefined = error.message;
    let code = 500;
    let data: any;
    let logData: any;
    if (error instanceof BaseError) {
        data = error.data;
        logData = error.logData;
    }

    if (error instanceof ValidationError) code = 400;
    if (error instanceof NotFoundError) code = 404;
    if (error instanceof UnauthorizedError) code = 401;
    if (code === 500 || logData) {
        if (code === 500) message = "Sorry an error occurred";
        console.log(error, logData);
    }

    return sendResponse(res, { code, message, data });
};
