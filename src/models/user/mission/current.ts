import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { IMission, MissionSchema } from './mission';

interface ICurrent extends IMission {
    startAt: Date;
    timeout_id: number;
}

interface ICurrentMethods {
    getRemainingTime(): String;
}

export type Current = HydratedDocument<ICurrent, ICurrentMethods>;

export const CurrentSchema: Schema = new Schema<ICurrent, object, ICurrentMethods>({
    startAt: {
        type: Date,
        required: true,
    },
    timeout_id: {
        type: Number,
        required: true,
    },
});

// Ajouter les champs de MissionSchema dans CurrentSchema
CurrentSchema.add(MissionSchema.obj);

CurrentSchema.methods.getRemainingTime = function (): string {
    const now = new Date();
    const diff = now.getTime() - this.startAt.getTime();

    const diffMin = Math.floor(diff / (1000 * 60));
    const remainingTimeMin = this.time - diffMin;

    const res = `${Math.floor(remainingTimeMin / 60)}h${Math.floor(remainingTimeMin % 60)
        .toString()
        .padStart(2, '0')}min`;
    return res;
};
