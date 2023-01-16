import { Schema, ValidationError } from "joi";
import { MiddlewareType } from "./types";
import { sendResponse } from "../../utils/functions";

export const validateBody = (schema: Schema) => {
    const middleware: MiddlewareType = async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (err) {
            if (err instanceof ValidationError) {
                sendResponse(res, { code: 400, message: err.message });
            }
            return;
        }
    };
    return middleware;
};
