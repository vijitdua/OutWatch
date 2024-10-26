import {env} from "../config/env.js";
import discordClient from "../config/discordClient.js";

export async function sendStatusOfflineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        await channel.send(`🚨 Service **${service}** is offline!`)
    } catch (error) {
        console.log(`error in sendStatusOfflineMessage in discordMessageService.js : ${error}`);
    }
}

export async function sendBugReportMessage(serviceId, description, email) {
    try {
        const channel = await discordClient.channels.fetch(env.discordBugReportChannelID);
        await channel.send(`🐞 New Bug Report for **Service ID: \`${serviceId}\`**\n**Reported by**: \`${email}\`\n**Description**: ${description}`);
    } catch (error) {
        console.log(`error in sendBugReportMessage in discordMessageService.js : ${error}`);
    }

}

export async function sendStatusBackOnlineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        await channel.send(`🟢 Service **${service}** is back online!`)
    } catch (error) {
        console.log(`error in sendStatusOfflineMessage in discordMessageService.js : ${error}`);
    }
}