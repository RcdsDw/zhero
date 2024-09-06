import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import UserBuilder from '../../libs/message/UserBuilder';

export const data = new SlashCommandBuilder().setName('play').setDescription('Joue');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {

        user = new UserModel({
            id : interaction.user.id
        });

        interaction.reply(await UserBuilder.skinForm(user));

        return;
    }

    user.experience.add(10);

    interaction.reply({
        embeds: [UserBuilder.profile(user)],
    });

    user.save();
}
