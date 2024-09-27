import {
    ActionRowBuilder,
    ActionRowData,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    UserSelectMenuBuilder,
} from 'discord.js';
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

    let response: BaseMessageOptions;

    switch (args[1]) {
        case 'Mission':
            response = await MissionBuilder.showMissions(user);
            break;
        case 'Shop':
            response = await ItemBuilder.shop(user, interaction.user);
            break;
        case 'Inventory':
            response = await ItemBuilder.inventory(user, interaction.user);
            break;
        case 'Stuff':
            response = await ItemBuilder.stuff(user);
            break;
        case 'Profile':
            response = await UserBuilder.profile(user);
            break;
        case 'Skin':
            response = await UserBuilder.skinForm(user);
            break;
        case 'Back':
            interaction.editReply(await UserBuilder.menu(user));
            return;
        default:
            interaction.editReply({
                content: 'Aucun bouton ne match',
                files: [],
                components: [],
            });
            return;
    }

    // Ajout d'un bouton retour au menu
    const backToMenuButton = new ButtonBuilder()
        .setCustomId('Menu-Back')
        .setLabel('Retour au menu')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️');

    const lastRow = response.components?.at(response.components.length - 1);

    if (lastRow === undefined) {
        response.components = [new ActionRowBuilder<ButtonBuilder>().addComponents(backToMenuButton)];
    } else if (lastRow instanceof ActionRowBuilder && lastRow.components.length < 5) {
        lastRow.addComponents(backToMenuButton);
    } else if (response.components && response.components.length < 5) {
        response.components = [
            ...response.components,
            new ActionRowBuilder<ButtonBuilder>().addComponents(backToMenuButton),
        ];
    }

    interaction.editReply(response);
}
