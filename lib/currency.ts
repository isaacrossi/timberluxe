import { MyBig } from "./big";

// Convert dollar float to cent integer safely
export const toCent = (amount: number) =>
  new MyBig(amount).mul(100).round(0).toNumber(); // rounding to 0 decimals for whole cents

// Convert cent integer to dollar float safely
export const fromCent = (amount: number) =>
  new MyBig(amount).div(100).round(2).toNumber();

// Format cents into Australian Dollars ($ AUD) with standard decimal representation
export const toCurrencyFromCent = (amount: number) => {
  const dollarVal = fromCent(amount);
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollarVal);
};
