import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';
import {messageRateLimit} from "../middleware/rateLimit.js";

const router = express.Router();

router.post('/', messageRateLimit, sendContactMessage);

export default router;