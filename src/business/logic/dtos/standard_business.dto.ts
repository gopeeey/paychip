import { BusinessModelInterface } from "../interfaces";
import { StandardDtoType } from "@bases/logic";
import { StandardCurrencyDto } from "@currency/logic";

export class StandardBusinessDto implements StandardDtoType<BusinessModelInterface> {
    readonly id: BusinessModelInterface["id"];
    readonly name: BusinessModelInterface["name"];
    readonly ownerId: BusinessModelInterface["ownerId"];
    readonly countryCode: BusinessModelInterface["countryCode"];
    readonly createdAt: BusinessModelInterface["createdAt"];
    readonly currencies?: StandardCurrencyDto[];

    constructor(body: BusinessModelInterface) {
        this.id = body.id;
        this.name = body.name;
        this.ownerId = body.ownerId;
        this.countryCode = body.countryCode;
        this.createdAt = body.createdAt;
        this.currencies = body.currencies?.map((currency) => new StandardCurrencyDto(currency));
    }
}
