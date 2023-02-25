import { ChargeSchemeServiceInterface } from "@logic/charge_scheme";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface ChargeSchemeRouteDependencies {
    chargeSchemeService: ChargeSchemeServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
