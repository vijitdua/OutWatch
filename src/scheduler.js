import cron from 'node-cron';
import { trackUptime } from './service/serviceStatusService.js';
import {sendStatusOfflineMessage} from "./service/discordMessageService.js";
import {sendPendingBugMessagesToDiscord} from "./service/bugReportService.js";

export function startCronJob() {
    // Runs every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        try {
            await trackUptime();
            await sendPendingBugMessagesToDiscord();
        } catch (error) {
            console.error('Error tracking uptime:', error);
            await sendStatusOfflineMessage('OutWatch');
        }
    });

    console.log("Cron job has been started.");
}