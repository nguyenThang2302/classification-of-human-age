export function code2FAValidator(code: any) {
  const regex = /^[0-9]{6}$/;

  if (!code) return "Code can't be empty.";
  if (!regex.test(code)) return "Code must be a 6-digit number.";

  return '';
}
