// commands/service-status.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Service from '../models/serviceModel.js';
import {trackUptime} from "../service/serviceStatusService.js";

export default {
    data: new SlashCommandBuilder()
        .setName('service-status')
        .setDescription('Displays the status of all services.'),
    async execute(interaction) {
        await interaction.deferReply(); // Defer the reply as fetching data might take time

        try {
            await trackUptime();
            const services = await Service.findAll();

            if (services.length === 0) {
                return interaction.editReply('No services found.');
            }

            const embed = new EmbedBuilder()
                .setTitle('📊 Service Status')
                .setColor(0x00AE86)
                .setTimestamp();

            services.forEach(service => {
                const statusEmoji = service.status === 'up' ? '🟢' : service.status === 'down' ? '🔴' : '⚪️';
                const downSince = service.downSince ? `<t:${Math.floor(new Date(service.downSince).getTime() / 1000)}:f>` : 'N/A';
                const lastChecked = `<t:${Math.floor(new Date(service.lastChecked).getTime() / 1000)}:f>`
                let serviceInfo = `**Status**: ${service.status.toUpperCase()}`;
                serviceInfo += service.downSince ? `\n**Down Since**: ${downSince}` : ``
                serviceInfo += `\n**Last Checked**: ${lastChecked}`;
                serviceInfo += `\nURL: ${service.url}`
                embed.addFields({
                    name: `${statusEmoji} ${service.serviceName}`,
                    value: serviceInfo,
                    inline: false,
                });
            });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('There was an error fetching the service statuses.');
        }
    },
};
