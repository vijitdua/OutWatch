import BugReport from "../models/bugReportModel.js";
import {sendBugReportMessage} from "./discordMessageService.js";

export async function createBugReport(serviceId, description, email){
    try{
        const report = await BugReport.create({ serviceId, description, email });
        await sendBugReportMessage(serviceId, description, email);
    } catch(error){
        console.log(`error in createBugReportMessage in bugReportService.js : ${error}`);
        throw error;
    }
}