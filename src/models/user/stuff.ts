import { HydratedDocument, Schema } from 'mongoose';
import { ItemModel, ItemSchema } from '../item/item';
import { AttributesModule } from './attributes';

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
    getTotalAttributes(): AttributesModule;
    getAllItems(): ItemModel[];
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

StuffSchema.methods.getAllItems = function (): ItemModel[] {
    const keys = Object.keys(this.toObject()).filter((s) => !s.startsWith('_'));
    return keys.map((k) => this[k]);
};

StuffSchema.methods.getTotalAttributes = function (): AttributesModule {
    const keys = Object.keys(this.toObject()).filter((s) => !s.startsWith('_'));

    const allAttributes: AttributesModule[] = keys.filter((k) => this[k] !== null).map((k) => this[k].attributes);

    const base: AttributesModule = allAttributes[0];

    allAttributes.shift();

    return allAttributes.reduce((acc: AttributesModule, current: AttributesModule) => current.add(acc), base);
};
