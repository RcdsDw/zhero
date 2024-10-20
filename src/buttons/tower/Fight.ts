import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
import { BaseMobModel } from '../../models/mob/baseMob';
import { Fighter } from '../../libs/fight/Fighter';
import FighterFactory from '../../libs/fight/FighterFactory';
import FightSystem from '../../libs/fight/FightSystem';
import { TowerSchema } from '../../models/user/tower';
import TowerBuilder from '../../libs/message/TowerBuilder';
export const id = /TowerButton/i;

export async function execute(interaction: ButtonInteraction) {
    const args = interaction.customId.split('-');

    const user = await UserModel.findByDiscordUser(interaction.user);

    if (!user) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte",
            ephemeral: true,
        });
        return;
    }

    // query for a mob
    const name = args[1];
    const mob = await BaseMobModel.findOne({ name });

    const bg = args[3];

    // fight
    const fighterMob: Fighter = FighterFactory.fromMob(mob);
    const fighterUser: Fighter = await FighterFactory.fromUser(user, interaction.user);

    const fight = new FightSystem(
        fighterUser,
        fighterMob,
        async (fight: FightSystem) => {
            interaction.editReply(await TowerBuilder.getFightEmbed(fighterUser, fighterMob, fight, bg));
        },
        (fight: FightSystem) => {
            fight.winner?.name === interaction.user.displayName ? TowerSchema.sendRewards(user, mob.lvl) : null;
        },
    );

    await interaction.update(await TowerBuilder.getFightEmbed(fighterUser, fighterMob, fight, bg));

    fight.makeFight();
}
