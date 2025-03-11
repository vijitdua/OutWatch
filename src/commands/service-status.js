import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Service from '../models/serviceModel.js';
import { trackUptime } from "../service/serviceStatusService.js";

export default {
    data: new SlashCommandBuilder()
        .setName('service-status')
        .setDescription('Displays the status of all services.'),

    async execute(interactionOrMessage) {
        // Check if it's a slash command (interaction) or a prefix command (message)
        const isSlashCommand = !!interactionOrMessage.deferReply; // Slash commands have `deferReply`
        const reply = isSlashCommand
            ? (content) => interactionOrMessage.editReply(content)
            : (content) => interactionOrMessage.channel.send(content);

        if (isSlashCommand) await interactionOrMessage.deferReply(); // Only defer reply for slash commands

        try {
            await trackUptime();
            const services = await Service.findAll();

            if (services.length === 0) {
                return reply('No services found.');
            }

            const embed = new EmbedBuilder()
                .setTitle('📊 Service Status')
                .setColor(0x00AE86)
                .setTimestamp();

            services.forEach(service => {
                const statusEmoji = service.status === 'up' ? '🟢' : service.status === 'down' ? '🔴' : '⚪️';
                const downSince = service.downSince ? `<t:${Math.floor(new Date(service.downSince).getTime() / 1000)}:f>` : 'N/A';
                const lastChecked = `<t:${Math.floor(new Date(service.lastChecked).getTime() / 1000)}:f>`;

                let serviceInfo = `**Status**: ${service.status.toUpperCase()}`;
                serviceInfo += service.downSince ? `\n**Down Since**: ${downSince}` : ``;
                serviceInfo += `\n**Last Checked**: ${lastChecked}`;
                serviceInfo += `\nURL: ${service.url}`;

                embed.addFields({
                    name: `${statusEmoji} ${service.serviceName}`,
                    value: serviceInfo,
                    inline: false,
                });
            });

            await reply({ embeds: [embed] });
        } catch (error) {
            await reply('There was an error fetching the service statuses.');
        }
    },
};
