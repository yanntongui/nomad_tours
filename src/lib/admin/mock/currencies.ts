import { CurrencyRate } from "@/lib/admin/types";

export const CURRENCIES: CurrencyRate[] = [
  { id: "cur-xof", code: "XOF", label: "Franc CFA (BCEAO)", rateToXOF: 1 },
  { id: "cur-eur", code: "EUR", label: "Euro", rateToXOF: 655.957 },
  { id: "cur-usd", code: "USD", label: "Dollar américain", rateToXOF: 604.5 },
  { id: "cur-gbp", code: "GBP", label: "Livre sterling", rateToXOF: 765.2 },
];
