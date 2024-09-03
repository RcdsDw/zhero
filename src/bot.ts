import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  Interaction,
} from 'discord.js';

import { getCommands } from './libs/commands/get-commands';

export const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

bot.commands = getCommands();

bot.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
        } else {
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
        }
    }
});