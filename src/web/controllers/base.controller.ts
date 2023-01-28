import { NextFunction } from "express";

export class BaseController {
    handleReq = async (next: NextFunction, callback: () => Promise<void>) => {
        try {
            await callback();
        } catch (err) {
            return next(err);
        }
    };
}
