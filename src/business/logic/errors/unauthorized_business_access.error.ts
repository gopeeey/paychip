import { UnauthorizedError } from "@bases/logic";

export class UnauthorizedBusinessAccessError extends UnauthorizedError {
    constructor() {
        super(
            "You do not have access to this business. Please contact the business admin to grant you access"
        );
    }
}
