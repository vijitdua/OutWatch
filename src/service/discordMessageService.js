import { env } from '../config/env.js';
import {discordClient} from '../config/discordClient.js';
import Service from "../models/serviceModel.js";

export async function sendStatusOfflineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const downSince = service.downSince ? `<t:${Math.floor(new Date(service.downSince).getTime() / 1000)}:f>` : '-';
        const message = `🚨 **${service.serviceName}** went offline at ${downSince}!\nURL: ${service.url}.`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in /service/discordMessageService.js -> sendStatusOfflineMessage: ${error}`);
        await sendErrorMessage(`Error in /service/discordMessageService.js -> sendStatusOfflineMessage: ${error}`);
    }
}

export async function sendStatusBackOnlineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const message = `🟢 **${service.serviceName}** is back online at <t:${Math.floor(new Date().getTime() / 1000)}:f>!\nURL: <${service.url}>`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in /service/discordMessageService.js -> sendStatusBackOnlineMessage: ${error}`);
        await sendErrorMessage(`Error in /service/discordMessageService.js -> sendStatusBackOnlineMessage: ${error}`);
    }
}

export async function sendBotOnlineAndReadyMessage() {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const message = ` ** 🔄Your discord bot restarted and is now online and ready. Your command prefix is \`${env.discordPrefix}\` or you can use slash commands`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in botJustCameOnline: ${error}`);
        await sendErrorMessage(`Error in /service/discordMessageService.js -> botJustCameOnline: ${error}`);
    }
}

export async function sendBugReportMessage(serviceId, description, email) {
    try {
        const service = await Service.findByPk(serviceId);
        const serviceName = service ? service.serviceName : 'Unknown Service';

        const channel = await discordClient.channels.fetch(env.discordBugReportChannelID);
        const message = `🐞 **${serviceName} – New Bug Report** \n**From**: \`${email || 'Anonymous'}\`\n**Description**: \n${description}`;
        await channel.send(message);
        return true;
    } catch (error) {
        console.log(`Error in /service/discordMessageService.js sendBugReportMessage: ${error}`);
        await sendErrorMessage(`Error in /service/discordMessageService.js -> sendBugReportMessage: ${error}`);
    }
}

export async function sendErrorMessage(content) {
    if(!env.discordErrorChannel) return; // Return if no channel specified.
    try {
        const channel = await discordClient.channels.fetch(env.discordErrorChannel);
        await channel.send(`⚠️ Unexpected error on your OutWatch instance:\n\`\`\`${content}\`\`\``);
        return true;
    } catch (error) {
        console.log(`Error in /service/discordMessageService.js -> sendErrorMessage: ${error}`);
    }
}
