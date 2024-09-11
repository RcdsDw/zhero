import { HydratedDocument, Schema } from "mongoose";
import { IBaseItem, ItemType } from "./baseItem";
import { AttributesSchema } from "../user/attributes";

enum Rarity {
    Poor,
    Common,
    Uncommon,
    Rare,
    Epic,  
    Legendary,
    Ultimate,
    Divine
}

interface IItem extends IBaseItem {
    rarity : Rarity,
    price : number
}

// Méthodes sur l'instance
interface IItemMethods {
    instance : () => void
}

export type ItemModel = HydratedDocument<IItem, IItemMethods>;

export const ItemSchema: Schema = new Schema<IItem, object, IItemMethods>(
    {
        name : {
            type : String,
            required : true
        },
        icon : {
            type : String,
            required : true
        },
        asset_men : {
            type : String,
            required : false
        },
        asset_women : {
            type : String,
            required : false
        },
        level : {
            type : Number,
            required : true
        },
        type : {
            type : String,
            enum : ItemType,
            required : true
        },
        attributes: {
            type: AttributesSchema,
            required: true,
            default: () => ({}),
        },
        rarity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true
        }
    },
    {
        timestamps: true,
    },
)