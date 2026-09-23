export const isValidEmail = (email = '') => /^\S+@\S+\.\S+$/.test(email.trim());

export const isValidUsername = (username = '') => /^[a-z0-9_]{3,30}$/.test(username.trim().toLowerCase());

export const getPasswordStrength = (password = '') => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', percent: 25, colorClass: 'bg-error' };
  if (score <= 3) return { label: 'Fair', percent: 55, colorClass: 'bg-amber-500' };
  if (score === 4) return { label: 'Strong', percent: 80, colorClass: 'bg-primary-container' };
  return { label: 'Excellent', percent: 100, colorClass: 'bg-emerald-500' };
};

export const validateRegisterForm = ({ name, username, email, password }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!isValidUsername(username)) {
    errors.username = 'Username must be 3-30 lowercase letters, numbers, or underscores';
  }
  if (!isValidEmail(email)) errors.email = 'Please provide a valid email address';
  if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password needs an uppercase letter and a number';
  }
  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Please provide a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validatePostForm = ({ content, codeSnippet, image }) => {
  const errors = {};
  const hasText = content && content.trim();
  const hasCode = codeSnippet && codeSnippet.trim();
  const hasImage = image && image.trim();

  if (!hasText && !hasCode && !hasImage) {
    errors.content = 'Add some text, a code snippet, or an image before publishing';
  } else if (content && content.length > 4000) {
    errors.content = 'Posts cannot exceed 4000 characters';
  }
  return errors;
};