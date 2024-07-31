export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "BDT", label: "৳ Taka", locale: "en-BD" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];
