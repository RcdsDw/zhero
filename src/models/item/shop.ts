import { HydratedDocument, Schema } from 'mongoose';
import { ItemModel, ItemSchema } from './item';
import { BaseItem, BaseItemModel } from './baseItem';
import { User } from '../user/user';
import Rarity from '../../enum/rarity';

// Temps de recharge en heure
const RELOAD_TIME = 12;

interface IShop {
    generatedAt: Date;
    items: ItemModel[];
}

// Méthodes sur l'instance
interface IShopMethods {
    getItems(user: User): Promise<ItemModel[]>;
    generateItems(): Promise<void>;
    getRemainingTime(): string;
}

export type ShopModule = HydratedDocument<IShop, IShopMethods>;

export const ShopSchema: Schema = new Schema<IShop, object, IShopMethods>({
    generatedAt: {
        type: Date,
    },
    items: {
        type: [ItemSchema],
        required: true,
        default: [],
    },
});

ShopSchema.methods.getItems = async function (user: User): Promise<ItemModel[]> {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - RELOAD_TIME);

    if (this.generatedAt === undefined || this.generatedAt < currentDate) {
        await this.generateItems(user);
        await user.save();
    }

    return this.items;
};

ShopSchema.methods.generateItems = async function (user: User) {
    this.generatedAt = new Date();

    const baseItems = await BaseItemModel.findByLevelAround(user.experience.level);

    this.items = baseItems.map((baseItem: BaseItem) => {
        const rarity: Rarity = Rarity.getRandom();

        baseItem.attributes.applyRarity(rarity);

        return {
            ...baseItem,
            price: Math.round(baseItem.level * rarity.multiplier),
            rarity: rarity.key,
        };
    });
};

ShopSchema.methods.getRemainingTime = function (): string {
    const now = new Date();
    const diff = now.getTime() - this.generatedAt.getTime();

    const diffMin = Math.floor(diff / (1000 * 60));
    const remainingTimeMin = RELOAD_TIME * 60 - diffMin;

    const res = `${Math.floor(remainingTimeMin / 60)}h${Math.floor(remainingTimeMin % 60)
        .toString()
        .padStart(2, '0')}min`;
    return res;
};
