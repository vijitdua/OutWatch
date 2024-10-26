import {createBugReport} from "../service/bugReportService.js";

export async function submitBugReport(req, res) {
    const { serviceId, description, email } = req.body;
    if (!serviceId || !description) return res.status(400).json({ error: 'Missing service id or description' });

    try {
        await createBugReport(serviceId, description, email);
        res.status(200).json({ message: 'Bug report submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit bug report' });
    }
}
