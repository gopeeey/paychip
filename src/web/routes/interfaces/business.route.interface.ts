import { BusinessServiceInterface } from "@logic/business";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface BusinessRouteDependencies {
    businessService: BusinessServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
