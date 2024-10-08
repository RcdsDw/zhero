import {
    ActionRowBuilder,
    AttachmentBuilder,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { User } from '../../models/user/user';
import { User as DiscordUser } from 'discord.js';
import { ItemModel } from '../../models/item/item';
import Rarity from '../../enum/rarity';
import { basename } from 'node:path';
import ItemType from '../../enum/itemType';
import AttributeBuilder from './AttributeBuilder';

export default class ItemBuilder {
    /**
     * Affiche le shop d'un user
     * @param user
     * @returns
     */
    public static async shop(user: User, discordUser: DiscordUser): Promise<BaseMessageOptions> {
        const items = await user.shop.getItems(user);

        if (items.length === 0) {
            return {
                content: `## Boutique de ${discordUser.toString()}
Vous avez **${user.gold} 🪙**. La boutique est vide, le marchand aura de nouveaux équipements pour vous dans **${user.shop.getRemainingTime()}**`,
                embeds: [],
                components: [],
            };
        }

        const data = items.map((i, index) => this.itemInShop(i, user, index));

        const row = new ActionRowBuilder<ButtonBuilder>();

        row.addComponents(data.map((d) => d.button));

        return {
            content: `## Boutique de ${discordUser.toString()}\nVous avez **${user.gold} 🪙, il reste ${user.shop.getRemainingTime()} avant le reset de la boutique**`,
            embeds: data.map((d) => d.embed),
            files: data.map((d) => d.file),
            components: [row],
        };
    }

    /**
     * Retourne l'embed et le fichier d'un item
     */
    private static itemInShop(
        item: ItemModel,
        user: User,
        index: number,
    ): { embed: EmbedBuilder; file: AttachmentBuilder; button: ButtonBuilder } {
        const file = new AttachmentBuilder(item.icon);

        const rarity = Rarity.getByKey(item.rarity);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(`Niveau : **${item.level}** - Prix : **${item.price}  🪙**`)
            .setColor(rarity.color)
            .setAuthor({
                name: ItemType.getByKey(item.type).name,
            })
            .setFooter({
                text: rarity.name,
            })
            .setThumbnail(`attachment://${basename(item.icon)}`);

        const button = new ButtonBuilder()
            .setCustomId(`ShopBuy-${index}`)
            .setLabel(`Acheter ${item.name}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(user.gold < item.price || user.inventory.items.length >= 5);

        const stuffedItem = user.stuff.getItemByType(item.type);

        embed.addFields(AttributeBuilder.getFields(item.attributes, stuffedItem));

        return {
            embed: embed,
            file: file,
            button: button,
        };
    }

    /**
     * Affiche l'inventaire d'un joueur, avec tous ses items et des boutons pour équiper et revendre les équipements
     * @param user
     * @param user1
     */
    public static async inventory(user: User, discordUser: DiscordUser): Promise<BaseMessageOptions> {
        const items = user.inventory.items;

        if (items.length === 0) {
            return {
                content: `## Inventaire de ${discordUser.toString()}
Votre inventaire est vide, la commande \`/shop\` permet d'acheter des items`,
                embeds: [],
                components: [],
            };
        }

        const data = items.map((i, index) => this.itemInInventory(i, user, index));

        const sellRow = new ActionRowBuilder<ButtonBuilder>().addComponents(data.map((d) => d.sellButton));
        const equipRow = new ActionRowBuilder<ButtonBuilder>().addComponents(data.map((d) => d.equipButton));

        return {
            content: `## Inventaire de ${discordUser.toString()}\n`,
            embeds: data.map((d) => d.embed),
            files: data.map((d) => d.file),
            components: [equipRow, sellRow],
        };
    }

    /**
     * Retourne l'embed et le fichier d'un item
     */
    private static itemInInventory(
        item: ItemModel,
        user: User,
        index: number,
    ): { embed: EmbedBuilder; file: AttachmentBuilder; sellButton: ButtonBuilder; equipButton: ButtonBuilder } {
        const file = new AttachmentBuilder(item.icon);

        const rarity = Rarity.getByKey(item.rarity);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(`Niveau : **${item.level}** - Prix de revente : **${item.getSellPrice()}  🪙**`)
            .setColor(rarity.color)
            .setAuthor({
                name: ItemType.getByKey(item.type).name,
            })
            .setFooter({
                text: rarity.name,
            })
            .setThumbnail(`attachment://${basename(item.icon)}`);

        const sellButton = new ButtonBuilder()
            .setCustomId(`ShopSell-${index}`)
            .setLabel(`Vendre ${item.name}`)
            .setStyle(ButtonStyle.Danger);

        const equipButton = new ButtonBuilder()
            .setCustomId(`Equip-${index}`)
            .setLabel(`Equiper ${item.name}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(item.level > user.experience.level);

        const stuffedItem = user.stuff.getItemByType(item.type);

        embed.addFields(AttributeBuilder.getFields(item.attributes, stuffedItem));

        return {
            embed,
            file,
            sellButton,
            equipButton,
        };
    }

    /**
     * Affiche le stuff d'un joueur
     * @param user
     * @param user1
     */
    public static async stuff(user: User): Promise<BaseMessageOptions> {
        const imagePath = await user.getImage();
        const file = new AttachmentBuilder(imagePath);

        const embed = new EmbedBuilder()
            .setTitle(`Stuff`)
            .setColor('Red')
            .setThumbnail(`attachment://${basename(imagePath)}`);

        ItemType.ITEMTYPES.forEach((type) => {
            const item = user.stuff.getItemByType(type.key);

            embed.addFields({
                name: `__${type.name}__ - ${item ? item.name : 'Aucun'}`,
                value: item ? AttributeBuilder.toString(item.attributes) : ' ',
            });
        });

        return {
            content: '',
            embeds: [embed],
            files: [file],
            components: [],
        };
    }
}
