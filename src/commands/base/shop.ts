import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import ItemBuilder from '../../libs/message/ItemBuilder';

export const data = new SlashCommandBuilder().setName('shop').setDescription('Affiche la boutique');

export async function execute(interaction: CommandInteraction) {
    const user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte, vous pouvez en créer un via la commande /play",
            ephemeral: true,
        });

        return;
    }

    interaction.reply(await ItemBuilder.shop(user, interaction.user));
}
