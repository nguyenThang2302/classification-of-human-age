export function matchingPasswordValidator(password: any, repeatPassword: any) {
  if (!repeatPassword) return "Repeat password can't be empty."
  if (password !== repeatPassword)
    return 'Password and repeat password must be matching.'
  return ''
}
