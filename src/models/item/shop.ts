import { HydratedDocument, Schema } from "mongoose";
import { ItemModel, ItemSchema } from "./item";
import { BaseItemModel } from "./baseItem";
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
    console.debug('Génération des items')

    this.generateAt = new Date();

    const baseItems = await BaseItemModel.findByLevelAround(user.experience.level);

    console.log(Rarity.getRandom());

    await user.save();
}