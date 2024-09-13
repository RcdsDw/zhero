import { HydratedDocument, Schema } from "mongoose";
import { ItemModel, ItemSchema } from "./item";
import { BaseItem, BaseItemModel, ItemType } from "./baseItem";
import { User } from "../user/user";
import Rarity from "./rarity";

// Temps de recharge en heure
const RELOAD_TIME = 12;

interface IShop {
    generateAt : Date,
    items : ItemModel[]
}

// Méthodes sur l'instance
interface IShopMethods {
    getItems(user : User) : Promise<ItemModel[]>;
    generateItems() : Promise<void>;
}

export type ShopModule = HydratedDocument<IShop, IShopMethods>;

export const ShopSchema: Schema = new Schema<IShop, object, IShopMethods>({
    generateAt : {
        type : Date,
    },
    items : {
        type : [ItemSchema],
        required : true,
        default : []
    }
})

ShopSchema.methods.getItems = async function(user : User) : Promise<ItemModel[]> {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - RELOAD_TIME);

    if(this.generateAt === undefined || this.generateAt > currentDate ) {
        await this.generateItems(user);
    }

    return this.items;
}

ShopSchema.methods.generateItems = async function(user : User) {
    this.generateAt = new Date();

    const baseItems = await BaseItemModel.findByLevelAround(user.experience.level);

    this.items = baseItems.map((baseItem : BaseItem) => {
        const rarity : Rarity = Rarity.getRandom();

       baseItem.attributes.applyRarity(rarity);

        return {
            ...baseItem,
            price : baseItem.level * rarity.multiplier,
            rarity : rarity.key
        }
    })

    await user.save();
}