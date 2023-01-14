import UserProfileService from "../../logic/services/user_profile";
import { Request, Response } from "express";
import { ControllerType } from "./types";

class UserProfileController {
    constructor(private readonly _service: UserProfileService) {}

    async signup(req: Request, res: Response) {
        return "";
    }
}

export default UserProfileController;
