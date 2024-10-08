import {
    EmbedBuilder,
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    BaseMessageOptions,
    User as DiscordUser
} from 'discord.js';
import { User } from '../../models/user/user';
import mobs from '../../datas/mobs.json'
import { basename } from 'node:path';

export default class TowerBuilder {
    public static async getEmbed(user: User, discordUser: DiscordUser): Promise<BaseMessageOptions> {
        const towerInfo = user.tower.getTowerInfo();
        const currentMob = mobs[towerInfo.currentStage - 1]
        const file = new AttachmentBuilder(currentMob.skin);
        
        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
            .setLabel(`Se battre`)
            .setCustomId(`TowerButton-fight`)
            .setStyle(ButtonStyle.Success),
        );
        

        console.log(basename(currentMob.skin))
        const embed = new EmbedBuilder()
            .setTitle('La tour des méchants pas gentils !!!')
            .setDescription(`C'est à toi de jouer ${discordUser.displayName}, ta quête pour devenir un héros continue...`)
            .setThumbnail(`attachment://${basename(currentMob.skin)}`)
            .setImage(`https://img.freepik.com/premium-vector/dark-back-street-alley-with-door-bar-trash-can-car-with-open-trunk-night_273525-1119.jpg?semt=ais_hybrid`)
            .addFields(
                {
                    name: `Votre prochain adversaire est : `,
                    value: `Nom : ${currentMob.name} \n Niveau : ${currentMob.lvl}`,
                },
                {
                    name: `Vous êtes actuellement à l'étage : `,
                    value: `${towerInfo.currentStage} / ${towerInfo.maxStage}`,
                }
            )

            return {
                embeds: [embed],
                components: [row],
                files: [file],
            };
    }
}