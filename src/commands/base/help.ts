import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import { getCommands } from '../../libs/discord/getCommands';

export const data = new SlashCommandBuilder().setName('help').setDescription('Résumé des commandes');

export async function execute(interaction: CommandInteraction) {
    const logo: string =
        'https://img.freepik.com/free-vector/cute-boy-super-hero-flying-cartoon-vector-icon-illustration-people-holiday-icon-concept-isolated_138676-5451.jpg';
    const thumbnail: string = 'https://cdn.dribbble.com/users/154752/screenshots/1244719/book.gif';
    const commands: Command[] = await getCommands();
    const embed = new EmbedBuilder().setTitle('Les commandes !').setThumbnail(thumbnail);
    commands.forEach((command) => {
        embed.addFields({
            name: `/${command.data.name}`,
            value: `${command.data.description}`,
        });
    });
    embed.setTimestamp();
    embed.setFooter({ text: "L'équipe ZHero", iconURL: logo });

    interaction.reply({ embeds: [embed] });
}
