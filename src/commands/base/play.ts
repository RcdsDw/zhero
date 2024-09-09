import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import UserBuilder from '../../libs/message/UserBuilder';

export const data = new SlashCommandBuilder().setName('play').setDescription('Joue');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {
        user = await UserModel.create({
            id: interaction.user.id,
        });

        const form = await UserBuilder.skinForm(user);

        interaction.reply(form);

        return;
    }

    user.experience.add(10);

    interaction.reply(await UserBuilder.profile(user));

    user.save();
}
