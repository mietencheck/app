/** Multiply decimal inputs and round half away from zero to cents once.
 * Keeping their decimal representations avoids binary half-cent errors such
 * as 5.10 * 90.5 * 1.1 becoming 507.7049999999999.
 */
export function multiplyMoney(...factors: number[]): number {
  if (factors.some((value) => !Number.isFinite(value))) return NaN;
  let numerator = 100n;
  let denominator = 1n;
  for (const value of factors) {
    const [mantissa, exponent = "0"] = String(value).toLowerCase().split("e");
    const [whole, fraction = ""] = mantissa.split(".");
    numerator *= BigInt(whole + fraction);
    const scale = fraction.length - Number(exponent);
    if (scale >= 0) denominator *= 10n ** BigInt(scale);
    else numerator *= 10n ** BigInt(-scale);
  }
  const sign = numerator < 0n ? -1 : 1;
  const absolute = numerator < 0n ? -numerator : numerator;
  const roundedCents = (absolute + denominator / 2n) / denominator;
  return (sign * Number(roundedCents)) / 100;
}
