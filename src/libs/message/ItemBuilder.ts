import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionReplyOptions } from 'discord.js';
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
    public static async shop(user : User, discordUser : DiscordUser): Promise<InteractionReplyOptions> {

        const items = await user.shop.getItems(user)

        const data = items.map(i => this.item(i));

        const row = new ActionRowBuilder<ButtonBuilder>();

        row.addComponents(data.map(d => d.button));
        
        return {
            content : `## Boutique de ${discordUser.toString()}\nVous avez **${user.gold} 🪙**`,
            embeds : data.map(d => d.embed),
            files : data.map(d => d.file),
            components : [row]    
        }
    }

    /**
     * Retourne l'embed et le fichier d'un item
     */
    public static item(item : ItemModel) : {embed : EmbedBuilder, file : AttachmentBuilder, button : ButtonBuilder} {

        const file = new AttachmentBuilder(item.icon);

        const rarity = Rarity.getByKey(item.rarity);

        let embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(`Niveau : **${item.level}** - Prix : **${item.price}  🪙**`)
            .setColor(rarity.color)
            .setAuthor({
                name : `${rarity.name} - ${rarity.dropRate} %`
            })
            .setFooter({
                text : ItemType.getByKey(item.type).name
            })
            .setImage(`attachment://${basename(item.icon)}`)
        
        const button = new ButtonBuilder()
            .setCustomId(`ShopBuy-${item.name}`)
            .setLabel(`Acheter ${item.name}`)
            .setStyle(ButtonStyle.Primary)

        item.attributes.addToEmbed(embed);

        return {
            embed : embed,
            file : file,
            button : button
        }
    }
}