import { BusinessModelInterface } from "../../interfaces";
import { StandardDtoType } from "../types";

export class StandardBusinessDto implements StandardDtoType<BusinessModelInterface> {
    readonly id: BusinessModelInterface["id"];
    readonly name: BusinessModelInterface["name"];
    readonly ownerId: BusinessModelInterface["ownerId"];
    readonly countryCode: BusinessModelInterface["countryCode"];
    readonly createdAt: BusinessModelInterface["createdAt"];

    constructor(body: BusinessModelInterface) {
        this.id = body.id;
        this.name = body.name;
        this.ownerId = body.ownerId;
        this.countryCode = body.countryCode;
        this.createdAt = body.createdAt;
    }
}
