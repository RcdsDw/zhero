import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import Mob from '../../libs/mobs/Mob';
import FighterFactory from '../../libs/fight/FighterFactory';
import { Fighter } from '../../libs/fight/Fighter';
import FightSystem from '../../libs/fight/FightSystem';
import mobs from '../../datas/mobs.json';
import FightBuilder from '../../libs/message/FightBuilder';

export const data = new SlashCommandBuilder().setName('fight').setDescription('Faire un combat test');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    const mobData = mobs[0];

    const mob = new Mob(mobData.name, mobData.lvl, mobData.skin, mobData.attributes);
    const fighterMob: Fighter = FighterFactory.fromMob(mob);
    const fighterUser: Fighter = await FighterFactory.fromUser(user, interaction.user);

    const fight = new FightSystem(fighterUser, fighterMob, 
        async (fight : FightSystem) => {
            interaction.editReply(
                await FightBuilder.getEmbed(fighterUser, fighterMob, fight)
            )
        },
        (fight : FightSystem) => {
            // Calcul des récompenses
        }
    );

    interaction.reply(
        await FightBuilder.getEmbed(fighterUser, fighterMob, fight)
    )

    fight.makeFight();
}
