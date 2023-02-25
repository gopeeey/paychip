import { ChargeSchemeServiceInterface } from "../../logic";
import { AuthMiddlewareInterface } from "../middleware";

export interface ChargeSchemeRouteDependencies {
    chargeSchemeService: ChargeSchemeServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
