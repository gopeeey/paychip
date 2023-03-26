import { BusinessModelInterface } from "@logic/business";
import { SessionInterface } from "@logic/session_interface";
import { CurrencyModelInterface } from "./currency.model.interface";
import { CurrencyRepoInterface } from "./currency.repo.interface";

export interface CurrencyServiceInterface {}

export interface CurrencyServiceDependencies {
    repo: CurrencyRepoInterface;
}
