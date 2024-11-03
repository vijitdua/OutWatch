import dotenv from "dotenv";
import {fileURLToPath} from "url";
import {dirname, join} from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../');

export const env = {

    corsOrigin: process.env.CORS_ORIGIN || '*',
    port: process.env.PORT || 3000,
    serverLocation: process.env.SERVER_LOCATION || '',

    database: process.env.DATABASE,
    databaseHost: process.env.DATABASE_HOST,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,

    discordBotToken: process.env.DISCORD_TOKEN,
    discordOutageChannelID: process.env.DISCORD_OUTAGE_CHANNEL_ID,
    discordBugReportChannelID: process.env.DISCORD_BUG_REPORT_CHANNEL_ID,
    discordGuildID: process.env.DISCORD_GUILD_ID,
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordMessageChannel: process.env.DISCORD_MESSAGE_CHANNEL || null,
    discordErrorChannel: process.env.DISCORD_ERROR_CHANNEL || null,

    rootLocation: projectRoot,
}