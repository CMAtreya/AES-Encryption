import express from 'express';
import {
  getSecrets,
  getSecret,
  createSecret,
  updateSecret,
  deleteSecret,
  getSecretStats,
  createOneTimeLink,
  getOneTimeSecret,
  shareSecret
} from '../controller/secretController.js';
import { protect } from '../middleware/auth.js';
import { secretValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public route for one-time access
router.get('/share/:token', getOneTimeSecret);

// All other routes are protected
router.use(protect);

router.route('/')
  .get(getSecrets)
  .post(secretValidation, validate, createSecret);

router.get('/stats', getSecretStats);

router.post('/:id/one-time', createOneTimeLink);
router.post('/:id/share', shareSecret);

router.route('/:id')
  .get(getSecret)
  .put(updateSecret)
  .delete(deleteSecret);

export default router;
