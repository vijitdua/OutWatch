// commands/service-status.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Service from '../models/serviceModel.js';

export default {
    data: new SlashCommandBuilder()
        .setName('service-status')
        .setDescription('Displays the status of all services.'),
    async execute(interaction) {
        console.log('Received /service-status command');
        await interaction.deferReply(); // Defer the reply as fetching data might take time

        try {
            console.log('Fetching services from the database...');
            const services = await Service.findAll();
            console.log(`Fetched ${services.length} services.`);

            if (services.length === 0) {
                console.log('No services found.');
                return interaction.editReply('No services found.');
            }

            console.log('Building embed message...');
            const embed = new EmbedBuilder()
                .setTitle('📊 Service Status')
                .setColor(0x00AE86)
                .setTimestamp();

            services.forEach(service => {
                const statusEmoji = service.status === 'up' ? '🟢' : service.status === 'down' ? '🔴' : '⚪️';
                const downSince = service.downSince ? new Date(service.downSince).toLocaleString() : 'N/A';
                embed.addFields({
                    name: `${statusEmoji} ${service.serviceName}`,
                    value: `**Status**: ${service.status.toUpperCase()}\n**Down Since**: ${downSince}`,
                    inline: false,
                });
            });

            console.log('Sending embed message...');
            await interaction.editReply({ embeds: [embed] });
            console.log('Embed message sent successfully.');
        } catch (error) {
            console.error('Error in /service-status command:', error);
            await interaction.editReply('There was an error fetching the service statuses.');
        }
    },
};
