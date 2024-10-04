import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import FighterFactory from '../../libs/fight/FighterFactory';
import { Fighter } from '../../libs/fight/Fighter';
import FightSystem from '../../libs/fight/FightSystem';
import FightBuilder from '../../libs/message/FightBuilder';
import { BaseMobModel } from '../../models/mob/baseMob';

export const data = new SlashCommandBuilder().setName('fight').setDescription('Faire un combat test');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    const mob = await BaseMobModel.findByLevelAround(user.experience.level);
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
