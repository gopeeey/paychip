import { Router } from "express";
import { AccountServiceInterface } from "../../contracts/interfaces";
import { AccountController } from "../controllers";
import { CreateAccountValidator, LoginValidator } from "../validators";
import { validateBody } from "../middleware/validation";

export default class AccountRoute {
    constructor(private readonly _service: AccountServiceInterface) {}

    init() {
        const router = Router();
        const controller = new AccountController(this._service);

        router.post("/signup", validateBody(CreateAccountValidator), controller.signup);
        router.post("/login", validateBody(LoginValidator), controller.login);

        return router;
    }
}
