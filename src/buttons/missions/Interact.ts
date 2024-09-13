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
        case 'mission1':
            const res1 = await user.mission.confirmMission(0, user, interaction)
            interaction.reply(res1)
            break;
        case 'mission2':
            const res2 = await user.mission.confirmMission(1, user, interaction)
            interaction.reply(res2)
            break;
        case 'mission3':
            const res3 = await user.mission.confirmMission(2, user, interaction)
            interaction.reply(res3)
            break;
        case 'mission4':
            const res4 = await user.mission.confirmMission(3, user, interaction)
            interaction.reply(res4)
            break;
        case 'mission5':
            const res5 = await user.mission.confirmMission(4, user, interaction)
            interaction.reply(res5)
            break;
        case 'missionStop':
            const res = await user.mission.stopCurrentMission()
            interaction.reply(res)
            break;
    }

    await user.save()
}