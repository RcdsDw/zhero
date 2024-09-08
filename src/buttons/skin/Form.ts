import { ButtonInteraction } from "discord.js";
import { Button } from "../../interfaces/button";

export const id = /SkinButton/i

export async function execute(interaction : ButtonInteraction) {
    interaction.reply({
        content : "Tout va bien"
    })
}