import { ButtonInteraction } from 'discord.js';
import { UserModel } from '../../models/user/user';
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

    switch (args[1]) {
        case 'fight':
            interaction.reply(`Doucement ${interaction.user}, c'est pas implémenté gros gouwmand !`);
            break;
    }
}
