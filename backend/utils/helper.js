/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Generate random string for various purposes
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Format error response
 */
export const errorResponse = (message, statusCode = 500) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

/**
 * Success response formatter
 */
export const successResponse = (data, message = 'Success') => {
  return {
    status: 'success',
    message,
    data
  };
};
