import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import TowerBuilder from '../../libs/message/TowerBuilder';

export const data = new SlashCommandBuilder().setName('tower').setDescription('Les infos de la tour');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    interaction.reply(await TowerBuilder.getEmbed(user, interaction.user));
}
