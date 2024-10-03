import { HydratedDocument, model, Model, Schema } from 'mongoose';

// Données du document
export interface ITower {
    maxStage: number
    currentStage: number
}

// Méthodes sur l'instance
interface ITowerMethods {
    static: () => void;
}

// Méthodes statiques
interface ITowerModel extends Model<ITower, object, ITowerMethods> {
    static: () => void;
}

export type TowerModule = HydratedDocument<ITower, ITowerMethods>;

export const TowerSchema: Schema = new Schema<ITower, object, ITowerMethods>({
});

const TowerModel = model<ITower, ITowerModel>('Tower', TowerSchema);

export { TowerModel };
