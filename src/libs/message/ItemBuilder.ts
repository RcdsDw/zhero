import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    InteractionReplyOptions,
} from 'discord.js';
import { User } from '../../models/user/user';
import { User as DiscordUser } from 'discord.js';
import { ItemModel } from '../../models/item/item';
import Rarity from '../../enum/rarity';
import { basename } from 'node:path';
import ItemType from '../../enum/itemType';

export default class ItemBuilder {
    
    /**
     * Affiche le shop d'un user
     * @param user
     * @returns
     */
    public static async shop(user: User, discordUser: DiscordUser): Promise<InteractionReplyOptions> {
        const items = await user.shop.getItems(user);

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
    private static itemInShop(item: ItemModel, user : User, index : number): { embed: EmbedBuilder; file: AttachmentBuilder; button: ButtonBuilder } {
        const file = new AttachmentBuilder(item.icon);

        const rarity = Rarity.getByKey(item.rarity);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(`Niveau : **${item.level}** - Prix : **${item.price}  🪙**`)
            .setColor(rarity.color)
            .setAuthor({
                name: `${rarity.name}`,
            })
            .setFooter({
                text: ItemType.getByKey(item.type).name,
            })
            .setImage(`attachment://${basename(item.icon)}`);

        const button = new ButtonBuilder()
            .setCustomId(`ShopBuy-${index}`)
            .setLabel(`Acheter ${item.name}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(user.gold < item.price || user.inventory.items.length >= 5);

        item.attributes.addToEmbed(embed);

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
    public static async inventory(user: User, discordUser: DiscordUser): Promise<InteractionReplyOptions> {
        const items = user.inventory.items;

        const data = items.map((i, index) => this.itemInInventory(i, user, index));

        const sellRow = new ActionRowBuilder<ButtonBuilder>().addComponents(data.map((d) => d.sellButton));
        const equipRow = new ActionRowBuilder<ButtonBuilder>().addComponents(data.map((d) => d.equipButton));

        return {
            content: `## Inventaire de ${discordUser.toString()}\n`,
            embeds: data.map((d) => d.embed),
            files: data.map((d) => d.file),
            components: [sellRow, equipRow],
        };
    }

    /**
     * Retourne l'embed et le fichier d'un item
     */
    private static itemInInventory(item: ItemModel, user : User, index : number): { embed: EmbedBuilder; file: AttachmentBuilder; sellButton: ButtonBuilder, equipButton: ButtonBuilder } {
        const file = new AttachmentBuilder(item.icon);

        const rarity = Rarity.getByKey(item.rarity);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(`Niveau : **${item.level}** - Prix de revente : **${Math.floor(item.price / 2)}  🪙**`)
            .setColor(rarity.color)
            .setAuthor({
                name: `${rarity.name}`,
            })
            .setFooter({
                text: ItemType.getByKey(item.type).name,
            })
            .setImage(`attachment://${basename(item.icon)}`);

        const sellButton = new ButtonBuilder()
            .setCustomId(`ShopSell-${index}`)
            .setLabel(`Vendre ${item.name}`)
            .setStyle(ButtonStyle.Primary)

        const equipButton = new ButtonBuilder()
            .setCustomId(`ShopEquip-${index}`)
            .setLabel(`Equiper ${item.name}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(item.level > user.experience.level);

        item.attributes.addToEmbed(embed);

        return {
            embed,
            file,
            sellButton,
            equipButton
        };
    }
}
