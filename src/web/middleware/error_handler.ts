import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/functions";
import { NotFoundError, ValidationError } from "../../logic/errors/base_errors";

const errorHandler = async (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!error || !(error instanceof Error)) return next(error);
    let message: string | undefined = error.message;
    let code = 500;

    if (error instanceof ValidationError) code = 400;
    if (error instanceof NotFoundError) code = 404;

    return sendResponse(res, { code, message });
};

export default errorHandler;
