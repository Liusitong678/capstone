import express from 'express';
import { getScore, getCoverLetter } from '../controllers/aiController.js';

const router = express.Router();

router.post('/score', getScore);
router.post('/cover-letter', getCoverLetter);

export default router;
