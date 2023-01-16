import { Router } from "express";
import UserProfileService from "../../logic/services/user_profile";
import UserProfileController from "../controllers/user_profile.controller";
import { CreateUserValidator, LoginValidator } from "../validators";
import { validateBody } from "../middleware/validation";

export default class UserProfileRoute {
    constructor(private readonly _service: UserProfileService) {}

    init() {
        const router = Router();
        const controller = new UserProfileController(this._service);

        router.post("/signup", validateBody(CreateUserValidator), controller.signup);
        router.post("/login", validateBody(LoginValidator), controller.login);

        return router;
    }
}
