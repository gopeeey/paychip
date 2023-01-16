import { DependencyContainerInterface } from "../../d_container";
import { Router } from "express";
import UserProfileRoute from "./user_profile.route";

export default class Routes {
    constructor(private readonly _container: DependencyContainerInterface) {}

    init() {
        const router = Router();

        const userRoutes = new UserProfileRoute(this._container.userProfileService).init();
        router.use("/user", userRoutes);

        return router;
    }
}
