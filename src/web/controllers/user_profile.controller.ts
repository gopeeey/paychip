import UserProfileService from "../../logic/services/user_profile";
import { NextFunction, Request, Response } from "express";
import BaseController from "./base.controller";
import { CreateUserProfileDto, LoginDto } from "../../logic/dtos";
import { sendResponse } from "../../utils/functions";

class UserProfileController extends BaseController {
    constructor(private readonly _service: UserProfileService) {
        super();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const createUserProfileDto = new CreateUserProfileDto(req.body as CreateUserProfileDto);
            const resData = await this._service.signup(
                new CreateUserProfileDto(createUserProfileDto)
            );
            sendResponse(res, { code: 201, data: resData });
        });
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        await this.handleReq(next, async () => {
            const loginDto = new LoginDto(req.body as LoginDto);
            const resData = await this._service.login(loginDto);
            sendResponse(res, { code: 200, data: resData });
        });
    };
}

export default UserProfileController;
