import { HydratedDocument, Model, Schema } from 'mongoose';

interface IAttributes {
  strength: number;
  health: number;
  dexterity: number;
}

// Méthodes sur l'instance
interface IAttributesMethods {
  getTotalPoints(): number;
}

// Méthodes statiques
interface IAttributesModel extends Model<IAttributes, {}, IAttributesMethods> {}

export type AttributesModule = HydratedDocument<IAttributes, IAttributesMethods>;

export const AttributesSchema: Schema = new Schema<IAttributes, IAttributesModel, IAttributesMethods>({
  strength: {
    type: Number,
    required: true,
    default: 0,
  },
  health: {
    type: Number,
    required: true,
    default: 0,
  },
  dexterity: {
    type: Number,
    required: true,
    default: 0,
  },
});
