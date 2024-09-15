import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
export const id = /ShopBuy/i;

export async function execute(interaction: ButtonInteraction) {
    const user = await UserModel.findByDiscordUser(interaction.user);

    if (!user) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte",
            ephemeral: true,
        });
        return;
    }

    // On doit verifique que celui qui clique, c'est bien son shop
    if(interaction.user.id !== interaction.message.mentions.parsedUsers.first()?.id) {
        interaction.reply({
            content: "Ce n'est pas votre shop !",
            ephemeral : true
        })
        return;
    }

    const args = interaction.customId.split('-');

    interaction.reply(await user.buyItemFromShop(parseInt(args[1])));
}
