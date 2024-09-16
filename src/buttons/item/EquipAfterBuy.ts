import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
import ItemBuilder from '../../libs/message/ItemBuilder';
export const id = /EquipAfterBuy-/i;

export async function execute(interaction: ButtonInteraction) {
    const user = await UserModel.findByDiscordUser(interaction.user);

    if (!user) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte",
            ephemeral: true,
        });
        return;
    }

    const args = interaction.customId.split('-');

    // On doit verifique que celui qui clique, c'est bien son shop
    if (interaction.user.id !== args[1]) {
        interaction.reply({
            content: "Ce n'est pas votre achat !",
            ephemeral: true,
        });
        return;
    }

    await user.equipItem(user.inventory.items.length - 1);

    await interaction.update({
        content: 'Achat réussi ! Vous avez équipé directement votre équipement',
        components: [],
    });
}
