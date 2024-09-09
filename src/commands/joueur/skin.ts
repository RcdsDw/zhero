import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import UserBuilder from '../../libs/message/UserBuilder';

export const data = new SlashCommandBuilder().setName('skin').setDescription('Modifie votre apparence');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {
        interaction.reply({
            content: "Vous n'avez pas encore de compte, vous pouvez en créer un via la commande /play",
            ephemeral: true,
        });

        return;
    }

    interaction.reply(await UserBuilder.skinForm(user));
}
