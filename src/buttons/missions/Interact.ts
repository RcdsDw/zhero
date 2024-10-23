import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
export const id = /MissionsButton/i;

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

    switch (args[1]) {
        case 'missionStop':
            interaction.reply(await user.mission.stopCurrentMission());
            break;
        default:
            interaction.reply(
                await user.mission.confirmMission(parseInt(args[1]), user, interaction, (xp, gold) => {
                    interaction.channel?.send(
                        `Félicitations ${interaction.user.toString()} ! Vous avez gagné ${xp} XP et ${gold} pièces d'or pour avoir terminé votre mission !`,
                    );
                    user.save();
                }),
            );
            break;
    }

    await user.save();
}
