import express from 'express';
import { submitBugReport } from '../controllers/bugReportController.js';
import {messageRateLimit} from "../middleware/rateLimit.js";

const router = express.Router();

router.post('/', messageRateLimit, submitBugReport);

export default router;
