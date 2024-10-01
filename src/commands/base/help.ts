import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import { Command } from '../../interfaces/command';
import { getCommands } from '../../libs/discord/getCommands';

export const data = new SlashCommandBuilder().setName('help').setDescription('Résumé des commandes');

export async function execute(interaction: CommandInteraction) {

    const commands: Command[] = (await getCommands());
    const embed = new EmbedBuilder();
    embed.setTitle("📖 Les commandes ! 📖")
    embed.setDescription("Voici le résumé des commandes actuellement disponibles.")
    commands.forEach(command => {
        embed.addFields({
            name: `${command.data.name.slice(0,1).toUpperCase()}${command.data.name.slice(1)}`,
            value: `${command.data.description}`,
            inline: true,
        })
    });

    interaction.reply({ embeds: [embed] })
}
