import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { AttributesModule, AttributesSchema } from '../user/attributes';
import * as fs from 'fs';
import * as path from 'path';

enum ItemType {
    BELT = 'belt',
    BOOTS = 'boots',
    CAPE = 'cape',
    GADGET = 'gadget',
    MASK = 'mask',
    SIDEKICK = 'sidekick',
    SUIT = 'suit',
    WEAPON = 'weapon'
}

// Données du document
interface IBaseItem {
    name : string,
    icon : string,
    asset_men : string,
    asset_women : string,
    level : number,
    type : ItemType
    attributes: AttributesModule
}

// Méthodes sur l'instance
interface IBaseItemMethods {
    static : () => void
}

// Méthodes statiques
interface IBaseItemModel extends Model<IBaseItem, object, IBaseItemMethods> {
    populateDb() : Promise<void>
}

export type BaseItem = HydratedDocument<IBaseItem, IBaseItemMethods>;

const BaseItemSchema: Schema = new Schema<IBaseItem, object, IBaseItemMethods>(
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
        }
    },
    {
        timestamps: true,
    },
);

BaseItemSchema.statics.populateDb = async (): Promise<void> => {
    const files = fs.readdirSync("images/items");

    const iconFiles = files.filter(f => f.match(/_i.png/i));

    console.log(iconFiles);
};

const BaseItemModel = model<IBaseItem, IBaseItemModel>('BaseItem', BaseItemSchema);

export { BaseItemModel };
