import { ChargeSchemeService } from "@logic/charge_scheme";
import { chargeSchemeRepo } from "./repo.charge_scheme";

export const chargeSchemeService = new ChargeSchemeService({ repo: chargeSchemeRepo });
