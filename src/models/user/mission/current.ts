import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { IMission } from './mission';

interface ICurrent extends IMission {
    isCompleted: boolean;
    startAt: Date;
}

// Méthodes sur l'instance
interface ICurrentMethods {
    getRemainingTime(): String;
}

interface ICurrentModel extends Model<ICurrent, {}, ICurrentMethods> {}

export type Current = HydratedDocument<ICurrent, ICurrentMethods>;

export const CurrentSchema: Schema = new Schema<ICurrent, {}, ICurrentMethods>({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    startAt: {
        type: Date,
        required: true,
    },
});

const CurrentModel = model<ICurrent, ICurrentModel>('Current', CurrentSchema);

export { CurrentModel };

CurrentSchema.methods.getRemainingTime = function (): string {
    const now = new Date();
    const diff = now.getTime() - this.startAt.getTime();

    const diffMin = (diff / 1000) / 60;
    const remainingTime = this.time - diffMin;

    const res = `${Math.floor(remainingTime / 60)}h${remainingTime % 60}min`;
    return res;
}