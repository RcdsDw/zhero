import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import Mob from '../../libs/mobs/Mob';
import FighterFactory from '../../libs/fight/FighterFactory';
import { Fighter } from '../../libs/fight/Fighter';
import FightSystem from '../../libs/fight/FightSystem';
import mobs from '../../datas/mobs.json';

export const data = new SlashCommandBuilder().setName('fight').setDescription('Faire un combat test');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    const mob = new Mob(mobs[10].name, mobs[10].lvl, mobs[10].skin, mobs[10].attributes);
    const fighterMob: Fighter = FighterFactory.fromMob(mob);
    const fighterUser: Fighter = FighterFactory.fromUser(user, interaction.user);
    const fight = new FightSystem(fighterUser, fighterMob);

    interaction.reply(`${await fight.makeFight(fighterUser, fighterMob).then((res) => {res === true ? console.log('Vous avez gagné') : console.log('Vous avez perdu...')})}`);
}
