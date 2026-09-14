/** Indian mobile numbers: 10 digits, starting 6-9. Ignores any +91/leading-zero/spaces prefix. */
export function isValidMobile(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
  return last10.length === 10 && /^[6-9]/.test(last10);
}
