// config/discordClient.js
import {Client, GatewayIntentBits, Events, REST, Routes} from 'discord.js';
import {env} from "./env.js";
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const PREFIX = env.discordPrefix;
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Function to load all command files
async function loadCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = (await import(`file://${filePath}`)).default;
        commands.push(command.data.toJSON());
    }

    return commands;
}

// Function to deploy commands
async function deployCommands() {
    const commands = await loadCommands();

    const rest = new REST({version: '10'}).setToken(env.discordBotToken);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Register commands globally (may take up to an hour to update)
        await rest.put(
            Routes.applicationCommands(env.discordClientId),
            {body: commands},
        );
        console.log(`Successfully reloaded ${commands.length} global (/) commands.`);

    } catch (error) {
        console.error('Error deploying commands:', error);
    }
}

// Event listener for when the client is ready
discordClient.once(Events.ClientReady, async (readyClient) => {
    console.log(`Discord bot ready! Logged in as ${readyClient.user.tag}`);

    // Deploy commands upon client ready
    await deployCommands();
});

// Event listener for handling slash interactions
discordClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commandName = interaction.commandName;
    let command;

    try {
        const commandFile = commandFiles.find(file => file.split('.')[0] === commandName);
        if (!commandFile) return;

        const commandPath = path.join(commandsPath, commandFile);
        command = (await import(`file://${commandPath}`)).default;
    } catch (error) {
        console.error(`Error loading command ${commandName}:`, error);
        return;
    }

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error executing that command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error executing that command!', ephemeral: true});
        }
    }
});


// Handle prefix-based commands
discordClient.on(Events.MessageCreate, async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    try {
        // Normalize file names (convert dashes to underscores, make lowercase)
        const commandFile = commandFiles.find(file =>
            file.split('.')[0].toLowerCase() === commandName
        );

        if (!commandFile) return;

        const commandPath = path.join(commandsPath, commandFile);
        const command = (await import(`file://${commandPath}`)).default;

        await command.execute(message, args);
    } catch (error) {
        console.error(`Error executing prefix command ${commandName}:`, error);
        await message.channel.send('An error occurred while executing this command.');
    }
});

// Handle Discord login
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

export {discordClient, discordReady};
