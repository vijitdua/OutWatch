import BugReport from "../models/bugReportModel.js";
import {sendBugReportMessage} from "./discordMessageService.js";

export async function createBugReport(serviceId, description, email){
    try{
        const report = await BugReport.create({ serviceId, description, email });
        const messageSent = await sendBugReportMessage(serviceId, description, email);
        if (messageSent) await report.update({ discordMessageSent: true });
    } catch(error){
        console.log(`error in createBugReportMessage in bugReportService.js : ${error}`);
        throw error;
    }
}

export async function sendPendingBugMessagesToDiscord(){
    try{
        const reports = await BugReport.findAll({
            where: {
                discordMessageSent: false
            }
        });
        for (const report of reports){
            const messageSent = await sendBugReportMessage(report.serviceId, report.description, report.email);
            if (messageSent) await report.update({ discordMessageSent: true });
        }
    }catch(error){
        console.log(`error in createBugReportMessage in bugReportService.js : ${error}`);
        throw error;
    }
}