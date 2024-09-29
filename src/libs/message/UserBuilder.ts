import {
    ActionRowBuilder,
    AttachmentBuilder,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    InteractionReplyOptions,
} from 'discord.js';
import { User } from '../../models/user/user';
import PartManager from '../montage/PartManager';
import AttributeBuilder from './AttributeBuilder';

export default class UserBuilder {
    public static async profile(user: User): Promise<InteractionReplyOptions> {
        const file = new AttachmentBuilder(await user.getImage(), {
            name: 'skin.png',
        });

        const embed = new EmbedBuilder()
            .setTitle('Votre profile')
            .addFields(
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
                {
                    name: 'Caractéristiques totale',
                    value: AttributeBuilder.toString(user.getTotalAttributes()),
                    inline: false,
                },
            )
            .setImage(`attachment://${file.name}`);

        return {
            content: '',
            embeds: [embed],
            files: [file],
            components: [],
        };
    }

    public static async skinForm(user: User): Promise<BaseMessageOptions | InteractionReplyOptions> {
        const file = new AttachmentBuilder(await user.skin.getImage(), {
            name: 'skin.png',
        });

        const rows = PartManager.getRows(user.skin);

        const embed = new EmbedBuilder({
            title: user.isNew ? 'Création de votre Zero' : 'Modification de votre Zero',
            description: 'Faites vous beau pour le quartier',
            image: {
                url: `attachment://${file.name}`,
            },
        });

        return {
            content: '',
            embeds: [embed],
            files: [file],
            components: rows,
            ephemeral: true,
        };
    }

    public static async menu(user: User): Promise<InteractionReplyOptions> {
        const file = new AttachmentBuilder(await user.getImage(), {
            name: 'skin.png',
        });

        const embed = new EmbedBuilder().setTitle('Résumé de votre aventure').setImage(`attachment://${file.name}`);

        await user.shop.getItems();
        let remainingTimeShop = user.shop.getRemainingTime();

        if (remainingTimeShop.startsWith('-')) {
            await user.shop.getItems(user);

            remainingTimeShop = user.shop.getRemainingTime();
        }

        embed.addFields(
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
            {
                name: 'Mission',
                value:
                    user.mission.current === null
                        ? 'Aucune mission en cours, **/shop** pour voir vos missions'
                        : 'Votre mission se termine dans ' + user.mission.current.getRemainingTime(),
            },
            {
                name: 'Boutique',
                value: 'De nouveaux items apparaissent dans ' + user.shop.getRemainingTime(),
            },
        );

        const rows = [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('Menu-Mission').setLabel('Missions').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('Menu-Shop').setLabel('Boutique').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('Menu-Inventory').setLabel('Inventaire').setStyle(ButtonStyle.Primary),
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('Menu-Skin').setLabel('Apparence').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('Menu-Stuff').setLabel('Equipement').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('Menu-Profile').setLabel('Profile').setStyle(ButtonStyle.Primary),
            ),
        ];

        return {
            content: '',
            embeds: [embed],
            files: [file],
            components: rows,
            ephemeral: false,
        };
    }
}
