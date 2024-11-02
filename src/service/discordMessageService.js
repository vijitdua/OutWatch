import { env } from '../config/env.js';
import {discordClient} from '../config/discordClient.js';
import Service from "../models/serviceModel.js";

export async function sendStatusOfflineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const downSince = service.downSince ? new Date(service.downSince).toLocaleString() : 'Unknown time';
        const message = `🚨 **${service.serviceName}** went offline at ${downSince}! \nService URL: ${service.url}.\nService ID: \`${service.serviceId}\``;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendStatusOfflineMessage: ${error}`);
    }
}

export async function sendStatusBackOnlineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const message = `🟢 **${service.serviceName}** is back online at ${new Date().toLocaleString()}!\nService URL: ${service.url}.\nService ID: \`${service.serviceId}\``;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendStatusBackOnlineMessage: ${error}`);
    }
}

export async function sendBotOnlineAndReadyMessage() {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const channel2 = await discordClient.channels.fetch(env.discordBugReportChannelID);
        const channel3 = await discordClient.channels.fetch(env.discordMessageChannel);
        const message = ` ** 🔄Your discord bot restarted and is now online and ready.`;
        await channel.send(message);
        await channel2.send(message);
        await channel3.send(message);
    } catch (error) {
        console.log(`Error in botJustCameOnline: ${error}`);
    }
}

export async function sendBugReportMessage(serviceId, description, email) {
    try {
        const service = await Service.findByPk(serviceId);
        const serviceName = service ? service.serviceName : 'Unknown Service';

        const channel = await discordClient.channels.fetch(env.discordBugReportChannelID);
        const message = `🐞 New Bug Report for **${serviceName}** \n(ServiceID: \`${serviceId}\`)\n\n**Reported by**: \n\`${email || 'Anonymous'}\`\n\n**Description**: \n${description}`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendBugReportMessage: ${error}`);
    }
}
