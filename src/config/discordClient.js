import {Client, GatewayIntentBits, Events} from 'discord.js';
import {env} from "./env.js";

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});


const discordReady = new Promise((resolve, reject) => {
    discordClient.once(Events.ClientReady, (readyClient) => {
        console.log(`Discord bot ready! Logged in as ${readyClient.user.tag}`);
        resolve();
    });

    discordClient.login(env.discordBotToken).catch((error) => {
        console.error('Failed to login to Discord:', error);
        reject(error);
    });
});

export { discordClient, discordReady };
