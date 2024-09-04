import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../../models/user";

export const data = new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue');

export async function execute(interaction : CommandInteraction) {

    const user = await User.findByDiscordUser(interaction.user);

    // Pas de compte trouvée, on crée un nouveau compte
    if(user === null) {
        await User.create({
            id : interaction.user.id
        })

        interaction.reply({
            content : "Vous n'aviez pas de compte, on en a crée un pour vous",
            ephemeral : true
        })

        return;
    }

    interaction.reply({
        content : `Vous avez bien un compte avec ${user.xp} xp`
    })
}

