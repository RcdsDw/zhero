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
    getCurrentStage(): number
    isBigStage(currentStage: number, isCurrentStageBig: boolean): void;
    sendRewards(user: User, rewardGold: number, currentStage: number): void;
}

// Méthodes statiques
interface ITowerModel extends Model<ITower, object, ITowerMethods> {
    static(): void;
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

TowerSchema.methods.isBigStage = function (): void {
    this.isCurrentStageBig = this.currentStage % 10 === 0;
    return this.isCurrentStageBig;
}

TowerSchema.methods.getCurrentStage = function (): number {
    return this.currentStage;
}

TowerSchema.methods.sendRewards = function (user: User): void {
    user.gold += this.rewardGold;
    this.currentStage >= 100 ? null : this.currentStage++
};

const TowerModel = model<ITower, ITowerModel>('Tower', TowerSchema);

export { TowerModel };
