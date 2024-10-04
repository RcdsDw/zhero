import { HydratedDocument, model, Model, Schema } from 'mongoose';
import Mob from '../../libs/mobs/Mob';
import { User } from './user';

// Données du document
export interface ITower {
    id: string;
    maxStage: number;
    currentStage: number;
    isCurrentStageBig: boolean;
    currentMob: Mob;
    rewardGold: number;
}

// Méthodes sur l'instance
interface ITowerMethods {
    sendRewards(user: User, rewardGold: number, currentStage: number): void;
}

// Méthodes statiques
interface ITowerModel extends Model<ITower, object, ITowerMethods> {
    isBigStage(currentStage: number, isCurrentStageBig: boolean): void;
}

export type TowerModule = HydratedDocument<ITower, ITowerMethods>;

export const TowerSchema: Schema = new Schema<ITower, object, ITowerMethods>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    maxStage: {
        type: Number,
        required: true,
        default: 100,
    },
    currentStage: {
        type: Number,
        required: true,
        default: 1,
    },
    isCurrentStageBig: {
        type: Boolean,
        required: true,
        default: false,
    },
    currentMob: {
        type: Mob,
        required: true,
        default: () => ({})
    },
    rewardGold: {
        type: Number,
        required: true,
        default: 0,
    }
});

TowerSchema.static.isBigStage = (currentStage: number, isCurrentStageBig: boolean): void => {
    isCurrentStageBig = currentStage % 10 === 0;
}

TowerSchema.methods.sendRewards = (user: User, rewardGold: number, currentStage: number): void => {
    user.gold += rewardGold;
    currentStage >= 100 ? null : currentStage++
};

const TowerModel = model<ITower, ITowerModel>('Tower', TowerSchema);

export { TowerModel };
