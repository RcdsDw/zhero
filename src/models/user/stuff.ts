import { HydratedDocument, Schema } from 'mongoose';
import { ItemModel, ItemSchema } from '../item/item';

// Données du document
interface IStuff {
    gadget: ItemModel;
    weapon: ItemModel;
    mask: ItemModel;
    suit: ItemModel;
    boots: ItemModel;
    sidekick: ItemModel;
    cape: ItemModel;
    belt: ItemModel;
}

// Méthodes sur l'instance
interface IStuffMethods {
    equipItem(item: ItemModel): void;
    getItemByType(type: string): ItemModel | null;
}

export type StuffModule = HydratedDocument<IStuff, IStuffMethods>;

export const StuffSchema: Schema = new Schema<IStuff, object, IStuffMethods>({
    gadget: {
        type: ItemSchema,
        default: null,
    },
    weapon: {
        type: ItemSchema,
        default: null,
    },
    mask: {
        type: ItemSchema,
        default: null,
    },
    suit: {
        type: ItemSchema,
        default: null,
    },
    boots: {
        type: ItemSchema,
        default: null,
    },
    sidekick: {
        type: ItemSchema,
        default: null,
    },
    cape: {
        type: ItemSchema,
        default: null,
    },
    belt: {
        type: ItemSchema,
        default: null,
    },
});

StuffSchema.methods.equipItem = function (item: ItemModel) {
    this[item.type] = item;
};

StuffSchema.methods.getItemByType = function (type: string): ItemModel | null {
    return this[type] ?? null;
};
