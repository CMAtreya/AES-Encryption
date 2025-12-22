import express from 'express';
import {
  getSecrets,
  getSecret,
  createSecret,
  updateSecret,
  deleteSecret,
  getSecretStats
} from '../controllers/secretController.js';
import { protect } from '../middleware/auth.js';
import { secretValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSecrets)
  .post(secretValidation, validate, createSecret);

router.get('/stats', getSecretStats);

router.route('/:id')
  .get(getSecret)
  .put(updateSecret)
  .delete(deleteSecret);

export default router;
