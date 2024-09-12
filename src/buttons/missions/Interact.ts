import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
import { CurrentModel } from '../../models/user/mission/current';
import { MissionModel } from '../../models/user/mission/mission';
import MissionBuilder from '../../libs/message/MissionBuilder';
export const id = /MissionsButton/i;

export async function execute(interaction: ButtonInteraction) {
    const args = interaction.customId.split('-');

    const action = args[1];
    const attribute = args[2] as keyof ISkin;

    const user = await UserModel.findByDiscordUser(interaction.user);

    if (!user) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte",
            ephemeral: true,
        });
        return;
    }

    switch (action) {
        case 'random':
            user.skin = PartManager.getRandomSkin();
            break;
        case 'gender':
            user.skin.switchGender();
            break;
        case 'previous':
            user.skin.decreaseAttribute(attribute);
            break;
        case 'next':
            user.skin.increaseAttribute(attribute);
            break;
        case 'confirm':
            await interaction.update({
                content: 'La modification de votre apparence à bien été prise en compte',
                embeds: [],
                components: [],
                files: [],
            });
            return;
    }

    await user.save();

    const form = await UserBuilder.skinForm(user);

    interaction.update({ ...form, fetchReply: true });
}