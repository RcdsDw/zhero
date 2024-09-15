import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import MissionBuilder from '../../libs/message/MissionBuilder';

export const data = new SlashCommandBuilder().setName('missions').setDescription('Voir les missions disponibles');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    interaction.reply(await MissionBuilder.showMissions(user));
}
