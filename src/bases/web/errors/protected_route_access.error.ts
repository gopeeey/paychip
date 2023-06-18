export class ProtectedRouteAccessError extends Error {
    route: string;
    constructor(route: string) {
        super(`Unauthorized access to ${route}`);
        this.route = route;
    }
}
