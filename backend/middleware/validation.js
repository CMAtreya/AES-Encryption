import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

// Registration validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters')
];

// Login validation rules
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Secret creation validation
export const secretValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Secret name is required')
    .isLength({ max: 100 })
    .withMessage('Secret name cannot exceed 100 characters'),
  body('type')
    .isIn(['password', 'api_key', 'database', 'ssh_key', 'token', 'other'])
    .withMessage('Invalid secret type'),
  body('encryptedData.ciphertext')
    .notEmpty()
    .withMessage('Encrypted ciphertext is required'),
  body('encryptedData.iv')
    .notEmpty()
    .withMessage('IV is required'),
  body('encryptedData.salt')
    .notEmpty()
    .withMessage('Salt is required'),
  body('encryptedData.authTag')
    .notEmpty()
    .withMessage('Authentication tag is required')
];
