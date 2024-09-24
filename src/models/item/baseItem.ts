import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { AttributesModule, AttributesSchema } from '../user/attributes';
import * as fs from 'fs';
import * as path from 'path';
import ItemType from '../../enum/itemType';

// Données du document
export interface IBaseItem {
    name: string;
    icon: string;
    asset_men: string;
    asset_women: string;
    level: number;
    type: string;
    attributes: AttributesModule;
}

// Méthodes sur l'instance
interface IBaseItemMethods {
    static: () => void;
}

// Méthodes statiques
interface IBaseItemModel extends Model<IBaseItem, object, IBaseItemMethods> {
    populateDb(force: boolean, limit? : number): Promise<void>;
    findByLevelAround(level: number): Promise<BaseItem[]>;
}

export type BaseItem = HydratedDocument<IBaseItem, IBaseItemMethods>;

export const BaseItemSchema: Schema = new Schema<IBaseItem, object, IBaseItemMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        asset_men: {
            type: String,
            required: false,
        },
        asset_women: {
            type: String,
            required: false,
        },
        level: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        attributes: {
            type: AttributesSchema,
            required: true,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    },
);

BaseItemSchema.statics.populateDb = async (force: boolean = false, limit? : number): Promise<void> => {
    const hasItem = await BaseItemModel.countDocuments();

    if (hasItem > 0 && force === false) {
        return;
    }

    await BaseItemModel.deleteMany();

    const files = fs.readdirSync('images/items');

    let iconFiles = files.filter((f: string) => f.match(/_i.png/i));

    if(limit) {
        iconFiles = iconFiles.slice(0, limit)
    }

    const currentByItem: { [key: string]: number } = {
        gadget: 0,
        weapon: 0,
        mask: 0,
        suit: 0,
        boots: 0,
        sidekick: 0,
        cape: 0,
        belt: 0,
    };

    iconFiles.map(async (f: string) => {
        const match = f.match(/^(?<type>.+?)_(?<name>.+)_i.png$/);

        if (!match) {
            return;
        }

        const type = match[1];
        const slug = match[2];

        const asset_path_women = path.join('images/items', `${type}_${slug}_f.png`);
        const asset_path_men = path.join('images/items', `${type}_${slug}_m.png`);

        const multiplier = 400 / ItemType.getByKey(type).total;

        currentByItem[type] += 1;

        const level = Math.round(multiplier * currentByItem[type]);

        const label = slug
            .replace(/_/g, ' ')
            .replace(/([a-zA-Z])(\d+)/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase());

        const doc = new BaseItemModel({
            icon: path.join('images/items', f),
            name: label,
            type: type,
            level: level,
        });

        if (fs.existsSync(asset_path_men) && fs.existsSync(asset_path_women)) {
            doc.asset_men = asset_path_men;
            doc.asset_women = asset_path_women;
        }

        doc.attributes.distributePoints(level * 3);

        await doc.save();
    });
};

/**
 * Retourne 5 item aléatoire à -10 + 10 niveaux
 * @param level
 * @returns
 */
BaseItemSchema.statics.findByLevelAround = async (level: number): Promise<BaseItem[]> => {
    const agg = await BaseItemModel.aggregate([
        { $match: { level: { $gte: level - 10, $lte: level + 10 } } },
        { $sample: { size: 5 } },
    ]).limit(5);

    return agg.map((a) => new BaseItemModel(a));
};

const BaseItemModel = model<IBaseItem, IBaseItemModel>('BaseItem', BaseItemSchema);

export { BaseItemModel };
