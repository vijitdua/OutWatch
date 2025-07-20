import { discordClient } from '../config/discordClient.js';
import { env } from '../config/env.js';

export async function sendContactMessage(req, res) {
    const {message} = req.body;

    if (!message || typeof message !== 'string' || message.length >= 2000) {
        return res.status(400).json({ error: 'Invalid or missing message. Ensure it is under 2000 characters.' });
    }

    if (!env.discordMessageChannel) {
        return res.status(503).json({ error: 'Contact feature is currently unavailable.' });
    }

    try {
        const channel = await discordClient.channels.fetch(env.discordMessageChannel);
        const discordMessage = `
        **📩 New Anonymous Message**\n\n${message}\n\n-# You can send Vijit anonymous messages @ [vijitdua.com/message](<https://vijitdua.com/message>)\n---`;
        await channel.send(discordMessage);

        res.status(200).json({ message: 'Contact message sent successfully.' });
    } catch (error) {
        console.error('Error in sendContactMessage:', error);
        res.status(500).json({ error: 'Failed to send contact message.' });
    }
}