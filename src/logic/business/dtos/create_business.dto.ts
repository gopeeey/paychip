import { BusinessModelInterface } from "../interfaces";

type requiredProps = Pick<BusinessModelInterface, "name" | "ownerId" | "countryCode">;

export class CreateBusinessDto implements requiredProps {
    readonly name: BusinessModelInterface["name"];
    readonly ownerId: BusinessModelInterface["ownerId"];
    readonly countryCode: BusinessModelInterface["countryCode"];

    constructor(body: requiredProps) {
        this.name = body.name;
        this.ownerId = body.ownerId;
        this.countryCode = body.countryCode;
    }
}
