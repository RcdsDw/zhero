import { AttachmentBuilder, BaseMessageOptions, EmbedBuilder } from 'discord.js';
import { User } from '../../models/user/user';

export default class UserBuilder {
    public static profile(user: User): EmbedBuilder {
        return new EmbedBuilder().setTitle('Votre profile').addFields(
            {
                name: 'Level',
                value: `${user.experience.level} (${user.experience.progression.toFixed(2)} %)`,
                inline: true,
            },
            {
                name: 'Or  🪙',
                value: user.gold.toString(),
                inline: true,
            },
        );
    }

    public static async skinForm(user : User) : Promise<BaseMessageOptions> {

        const file = new AttachmentBuilder(await user.skin.getImage(), {
            name : "skin.png"
        }); 

        const embed = new EmbedBuilder({
            title : user.isNew ? "Création de votre Zero" : "Modification de votre Zero",
            description : "Faite vous beau pour le quartier",
            image : {
                url : `attachment://${file.name}`
            }
        })

        return {
            embeds : [embed],
            files : [file]
        }
    }
}
