import { BusinessServiceInterface } from "../../logic";
import { AuthMiddlewareInterface } from "../middleware";

export interface BusinessRouteDependencies {
    businessService: BusinessServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
