export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateRegistrationInput(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Invalid email address');
  }

  if (!password || !isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  if (!firstName || !isValidName(firstName)) {
    errors.push('First name must be at least 2 characters');
  }

  if (!lastName || !isValidName(lastName)) {
    errors.push('Last name must be at least 2 characters');
  }

  return { valid: errors.length === 0, errors };
}

export function validateLoginInput(email: string, password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Invalid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return { valid: errors.length === 0, errors };
}
