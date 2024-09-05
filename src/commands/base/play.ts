import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import UserBuilder from '../../libs/embed/UserBuilder';
import PartManager from '../../libs/montage/PartManager';

export const data = new SlashCommandBuilder().setName('play').setDescription('Joue');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if (user === null) {

        const layerManager = new PartManager();

        const skin = layerManager.getRandomSkin();

        interaction.reply({
            content: "Vous n'aviez pas de compte, on en a crée un pour vous",
            files : [await layerManager.getImage(skin)],
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
