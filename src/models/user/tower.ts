import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { User } from './user';
import { BaseMob } from '../mob/baseMob';

// Données du document
export interface ITower {
    maxStage: number;
    currentStage: number;
    isCurrentStageBig: boolean;
    rewardGold: number;
    mobs: Array<BaseMob>
}

// Méthodes sur l'instance
interface ITowerMethods {
    getCurrentStage(): number
    isBigStage(currentStage: number, isCurrentStageBig: boolean): void;
    sendRewards(user: User, lvlMob: number): void;
}

// Méthodes statiques
interface ITowerModel extends Model<ITower, object, ITowerMethods> {
    static(): void;
}

export type TowerModule = HydratedDocument<ITower, ITowerMethods>;

export const TowerSchema: Schema = new Schema<ITower, object, ITowerMethods>({
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
    rewardGold: {
        type: Number,
        required: true,
        default: 0,
    },
});

TowerSchema.methods.isBigStage = function (): void {
    this.isCurrentStageBig = this.currentStage % 10 === 0;
    return this.isCurrentStageBig;
}

TowerSchema.methods.getTowerInfo = function (): Object {
    const res = {
        currentStage: this.currentStage,
        maxStage: this.maxStage,
        rewardGold: this.rewardGold
    }
    return res
}

TowerSchema.methods.sendRewards = function (user: User, lvlMob: number): void {
    this.rewardGold = lvlMob * 10
    user.gold += this.rewardGold;
    this.currentStage >= 100 ? null : this.currentStage++
};

const TowerModel = model<ITower, ITowerModel>('Tower', TowerSchema);

export { TowerModel };
