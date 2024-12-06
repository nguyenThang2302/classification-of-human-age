export function passwordValidator(password: any) {
    const regex = /(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!password) return "Password can't be empty."
    if (password.length < 5 || !regex.test(password)) return 'Password must be at least 5 characters long, contain at least one uppercase letter, contain at least one special character'
    return ''
}