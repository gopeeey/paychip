import { BusinessModelInterface } from "@logic/business";
import { SessionInterface } from "@logic/session_interface";
import { CurrencyModelInterface } from "./currency.model.interface";

export interface CurrencyRepoInterface {
    getAll: () => Promise<CurrencyModelInterface[]>;
    getActive: () => Promise<CurrencyModelInterface[]>;
}
