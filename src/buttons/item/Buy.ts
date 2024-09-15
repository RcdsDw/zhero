import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, User } from 'discord.js';
import { UserModel } from '../../models/user/user';
import ItemBuilder from '../../libs/message/ItemBuilder';
export const id = /ShopBuy/i;

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

    // On doit verifique que celui qui clique, c'est bien son shop
    if (interaction.user.id !== interaction.message.mentions.parsedUsers.first()?.id) {
        interaction.reply({
            content: "Ce n'est pas votre shop !",
            ephemeral: true,
        });
        return;
    }

    const args = interaction.customId.split('-');

    try {
        const res = await user.buyItem(parseInt(args[1]))

        await interaction.editReply(await ItemBuilder.shop(user, interaction.user));

        const row = new ActionRowBuilder<ButtonBuilder>();

        // Envoie d'un bouton en plus si on peut porter l'équipement
        if(res) {
            row.addComponents(
                new ButtonBuilder().setCustomId(`EquipAfterBuy-${interaction.user.id}`).setLabel('Equiper votre achat').setStyle(ButtonStyle.Success)
            )
        }

        await interaction.followUp({
            content : 'Achat réussi !',
            components : row.components.length > 0 ? [row] : []
        });

    } catch (error) {        
        await interaction.followUp((error as Error).message);
    }
}
