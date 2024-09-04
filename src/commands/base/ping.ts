import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong');

export async function execute(interaction : CommandInteraction) {
    interaction.reply({
        content : "Pong !",
        ephemeral : true
    })
}

