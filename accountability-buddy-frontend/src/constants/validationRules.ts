// Validation Rules Configuration

export const VALIDATION_RULES = {
    REGEX: {
      EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PHONE: /^\+?[1-9]\d{1,14}$/,
      URL: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[^\s]*)?$/,
      PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    },
    LENGTH: {
      PASSWORD_MIN: 8,
      PASSWORD_MAX: 32,
      USERNAME_MIN: 3,
      USERNAME_MAX: 20,
    },
    MESSAGES: {
      EMAIL: "Please enter a valid email address.",
      PHONE: "Please enter a valid phone number.",
      URL: "Please enter a valid URL.",
      PASSWORD:
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      USERNAME:
        "Username must be between 3 and 20 characters long and contain no special characters.",
    },
  };
  
  // Example Usage:
  // VALIDATION_RULES.REGEX.EMAIL.test("example@example.com") -> true
  // VALIDATION_RULES.LENGTH.PASSWORD_MIN -> 8
  // VALIDATION_RULES.MESSAGES.EMAIL -> 'Please enter a valid email address.'
  