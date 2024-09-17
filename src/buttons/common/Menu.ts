import { ButtonInteraction, UserSelectMenuBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import MissionBuilder from '../../libs/message/MissionBuilder';
import ItemBuilder from '../../libs/message/ItemBuilder';
import UserBuilder from '../../libs/message/UserBuilder';

export const id = /Menu-/i;

export async function execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();

    const user = await UserModel.findByDiscordUser(interaction.user);

    if (!user) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte",
            ephemeral: true,
        });
        return;
    }

    const args = interaction.customId.split('-');

    switch(args[1]) {
        case 'Mission':
            interaction.editReply(await MissionBuilder.showMissions(user));
        break;
        case 'Shop':
            interaction.editReply(await ItemBuilder.shop(user, interaction.user));
        break;
        case 'Inventory':
            interaction.editReply(await ItemBuilder.inventory(user, interaction.user));
        break;
        case 'Stuff':
            interaction.editReply(await ItemBuilder.stuff(user));
        break;
        case 'Profile':
            interaction.editReply(await UserBuilder.profile(user));
        break;
        case 'Skin':
            interaction.editReply(await UserBuilder.skinForm(user));
        break;
    }
}
