import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/env.js';

// Protect routes - JWT authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Attach user to request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found. Token invalid.'
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          status: 'error',
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};
