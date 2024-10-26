import { env } from '../config/env.js';
import {discordClient} from '../config/discordClient.js';
import Service from "../models/serviceModel.js";

export async function sendStatusOfflineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const downSince = service.downSince ? new Date(service.downSince).toLocaleString() : 'Unknown time';
        const message = `🚨 **${service.serviceName}** (ID: ${service.serviceId}) went offline at ${downSince}!`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendStatusOfflineMessage: ${error}`);
    }
}

export async function sendStatusBackOnlineMessage(service) {
    try {
        const channel = await discordClient.channels.fetch(env.discordOutageChannelID);
        const message = `🟢 **${service.serviceName}** (ID: ${service.serviceId}) is back online at ${new Date().toLocaleString()}!`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendStatusBackOnlineMessage: ${error}`);
    }
}

export async function sendBugReportMessage(serviceId, description, email) {
    try {
        const service = await Service.findByPk(serviceId);
        const serviceName = service ? service.serviceName : 'Unknown Service';

        const channel = await discordClient.channels.fetch(env.discordBugReportChannelID);
        const message = `🐞 New Bug Report for **${serviceName}** (ID: \`${serviceId}\`)\n**Reported by**: \`${email || 'Anonymous'}\`\n**Description**: ${description}`;
        await channel.send(message);
    } catch (error) {
        console.log(`Error in sendBugReportMessage: ${error}`);
    }
}
