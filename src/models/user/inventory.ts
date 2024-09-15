import { HydratedDocument, Schema } from 'mongoose';
import { ItemModel, ItemSchema } from '../item/item';

// Données du document
interface IInventory {
    items: ItemModel[];
}

// Méthodes sur l'instance
interface IInventoryMethods {}

export type InventoryModule = HydratedDocument<IInventory, IInventoryMethods>;

export const InventorySchema: Schema = new Schema<IInventory, object, IInventoryMethods>({
    items: {
        type: [ItemSchema],
        required: true,
        default: []
    },
});
