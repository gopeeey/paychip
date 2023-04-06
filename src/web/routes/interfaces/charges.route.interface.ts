import { ChargesServiceInterface } from "@logic/charges";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface ChargeStackRouteDependencies {
    chargesService: ChargesServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
