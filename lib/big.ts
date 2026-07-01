import Big from "big.js";

// Force decimal precision of 2 (rounds calculations to whole cents)
Big.DP = 2;

// Use Round Half-Even (Banker's Rounding) to prevent cumulative financial bias
Big.RM = Big.roundHalfEven;

export const MyBig = Big;
