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
            const resStop = await user.mission.stopCurrentMission()
            interaction.reply(resStop)
            break;
        case args[1]:
            const res = await user.mission.confirmMission(args[1], user, interaction)
            interaction.reply(res)
            break;
    }

    await user.save()
}