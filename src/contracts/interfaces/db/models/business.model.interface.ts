import { BaseModelInterface } from "./base.model.interface";

export interface BusinessModelInterface extends BaseModelInterface {
    id: number;
    ownerId: string;
    name: string;
    countryCode: string;
}
