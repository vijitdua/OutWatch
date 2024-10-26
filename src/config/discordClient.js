import {Client, GatewayIntentBits, Events} from 'discord.js';
import {env} from "./env.js";

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

discordClient.login(env.discordBotToken).catch(error => {
    console.error('Failed to login to Discord: ', error);
});

discordClient.once(Events.ClientReady, async (readyClient) => {
    console.log(`Discord bot ready! Logged in as ${readyClient.user.tag}`);
});

export default discordClient;
