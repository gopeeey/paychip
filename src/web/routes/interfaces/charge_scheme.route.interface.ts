import { ChargeStackServiceInterface } from "@logic/charges";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface ChargeStackRouteDependencies {
    chargeStackService: ChargeStackServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
