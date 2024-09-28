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

    const mob = new Mob(mobs[0].name, mobs[0].lvl, mobs[0].skin, mobs[0].attributes);
    const fighterMob: Fighter = FighterFactory.fromMob(mob);
    const fighterUser: Fighter = FighterFactory.fromUser(user, interaction.user);

    const fight = new FightSystem(fighterUser, fighterMob, 
        (fight : FightSystem) => {
            interaction.editReply({
                embeds : [FightBuilder.getEmbed(fighterUser, fighterMob, fight)]
            })
        },
        (fight : FightSystem) => {
            // Calcul des récompenses
        }
    );

    interaction.reply({
        embeds : [FightBuilder.getEmbed(fighterUser, fighterMob, fight)]
    })

    fight.makeFight();
}
