import express from 'express';
import { getAllServiceStatus } from '../controllers/statusController.js';

const router = express.Router();

router.get('/', getAllServiceStatus);

export default router;
