import { APIEmbedField } from 'discord.js';
import { AttributesModule, IAttributes } from '../../models/user/attributes';
import { ItemModel } from '../../models/item/item';
import Attribute from '../../enum/attribute';

export default class AttributeBuilder {
    public static getFields(attribute: AttributesModule, stuffedItem: ItemModel | null = null): APIEmbedField[] {
        const keys = Object.keys(attribute.toObject()).filter((s) => !s.startsWith('_'));

        const stuffAttributes = stuffedItem?.attributes;

        return keys.map((k) => {
            let value = ' ';
            const key = k as keyof IAttributes;

            if (stuffAttributes) {
                const difference = attribute[key] - stuffAttributes[key];
                value = '```diff\n' + (difference > 0 ? '+ ' + difference.toString() : difference.toString()) + '\n```';
            }

            return {
                name: `**${attribute[key]}** ${Attribute.getByKey(k).name} ${Attribute.getByKey(k).emoji}`,
                value: value,
                inline: true,
            };
        });
    }

    public static toString(attribute: AttributesModule): string {
        const keys = Object.keys(attribute).filter((s) => !s.startsWith('_') && attribute[s as keyof IAttributes] > 0);

        return keys
            .map(
                (k) =>
                    `**${attribute[k as keyof IAttributes]}** ${Attribute.getByKey(k).name} ${Attribute.getByKey(k).emoji}`,
            )
            .join('\n');
    }
}
