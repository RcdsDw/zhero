import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import UserBuilder from '../../libs/embed/UserBuilder';

export const data = new SlashCommandBuilder().setName('play').setDescription('Joue');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {
        user = await UserModel.create({
            id: interaction.user.id,
        });

        interaction.reply({
            content: "Vous n'aviez pas de compte, on en a crée un pour vous",
            embeds: [UserBuilder.profile(user)],
            ephemeral: true,
        });

        return;
    }

    user.experience.add(10);

    interaction.reply({
        embeds: [UserBuilder.profile(user)],
    });

    user.save();
}
