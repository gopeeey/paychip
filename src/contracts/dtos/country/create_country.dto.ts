import { CountryModelInterface } from "../../interfaces";

type requiredProps = Pick<CountryModelInterface, "isoCode" | "name">;

export class CreateCountryDto implements requiredProps {
    readonly isoCode: string;
    readonly name: string;

    constructor(body: requiredProps) {
        this.isoCode = body.isoCode;
        this.name = body.name;
    }
}
