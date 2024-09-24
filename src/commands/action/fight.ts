import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import FightSystem from '../../libs/fight/FightSystem';
import mobs from '../../datas/mobs.json';

export const data = new SlashCommandBuilder().setName('missions').setDescription('Voir les missions disponibles');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    let fight = new FightSystem();

    console.log((await fight.makeFight(user, mobs[10])) === true ? 'Vous avez gagné' : 'Vous avez perdu...');
}
