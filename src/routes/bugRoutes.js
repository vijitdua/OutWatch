import express from 'express';
import { submitBugReport } from '../controllers/bugReportController.js';

const router = express.Router();

router.post('/', submitBugReport);

export default router;
