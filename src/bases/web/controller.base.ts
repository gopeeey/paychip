import { NextFunction } from "express";

export class BaseController {
    handleReq = async (next: NextFunction, callback: () => Promise<void>) => {
        try {
            await callback();
        } catch (err) {
            // if an error occurs within the controller, catch it and hand it over
            // to the error handler
            return next(err);
        }
    };
}
