import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    BaseMessageOptions,
    User as DiscordUser
} from 'discord.js';
import { User } from '../../models/user/user';

export default class TowerBuilder {
    public static async getEmbed(user: User, discordUser: DiscordUser): Promise<BaseMessageOptions> {
        const towerInfo = user.tower.getTowerInfo();

        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setLabel(`Se battre`)
                .setCustomId(`TowerButton-fight`)
                .setStyle(ButtonStyle.Success),
        );

        const embed = new EmbedBuilder()
            .setTitle('La tour des méchants pas gentils !!!')
            .setDescription(`Bonjour ${discordUser.displayName}, il vous faudra tous les vaincre pour devenir le héros que vous voulez être`)
            .setImage(`https://img.freepik.com/premium-vector/dark-back-street-alley-with-door-bar-trash-can-car-with-open-trunk-night_273525-1119.jpg?semt=ais_hybrid`)
            .addFields({
                name: `Etage actuel`,
                value: `Vous êtes actuellement à l'étage : ${towerInfo.currentStage} / ${towerInfo.maxStage}`,
            })

            return {
                embeds: [embed],
                components: [row],
                files: [],
            };
    }
}