import { EmbedBuilder } from "discord.js";
import { UserInstance } from "../../models/user/user";

export default class UserBuilder {
    public static profile(user : UserInstance): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("Votre profile")
            .addFields(
                {
                    name : "Level",
                    value : `${user.experience.level} (${user.experience.progression.toFixed(2)} %)`,
                    inline : true
                },
                {
                    name : "Or  🪙",
                    value : user.gold.toString(),
                    inline : true
                }
            )
    }
}