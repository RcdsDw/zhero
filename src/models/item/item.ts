import { HydratedDocument, Schema } from "mongoose";
import { BaseItemSchema, IBaseItem } from "./baseItem";

interface IItem extends IBaseItem {
    rarity : string,
    price : number
}

// Méthodes sur l'instance
interface IItemMethods {
    instance : () => void
}

export type ItemModel = HydratedDocument<IItem, IItemMethods>;

export const ItemSchema: Schema = new Schema<IItem, object, IItemMethods>(
    {
        rarity : {
            type : String,
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

ItemSchema.add(BaseItemSchema.obj)