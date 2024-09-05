import { Events, Interaction } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        // Redirige sur les slashs commands
        if (interaction.isChatInputCommand()) {
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
        } else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);

            if (!button) {
                console.error(`No button matching ${interaction.customId} was found.`);
                return;
            }

            try {
                button.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'There was an error while executing this button!',
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error while executing this button!',
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
