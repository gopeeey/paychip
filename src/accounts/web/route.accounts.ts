import { Router } from "express";
import { AccountServiceInterface } from "@accounts/logic";
import { AccountController, CreateAccountValidator, LoginValidator } from "@accounts/web";
import { validateBody } from "../../web/middleware/validation";

export class AccountRoute {
    constructor(private readonly _service: AccountServiceInterface) {}

    init = () => {
        const router = Router();
        const controller = new AccountController(this._service);

        router.post("/signup", validateBody(CreateAccountValidator), controller.signup);
        router.post("/login", validateBody(LoginValidator), controller.login);

        return router;
    };
}
