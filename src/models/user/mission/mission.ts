import { HydratedDocument, model, Model, Schema } from 'mongoose';

export interface IMission {
    title: string;
    desc: string;
    rank: number;
    time: number;
}

// Méthodes sur l'instance
interface IMissionMethods {}

interface IMissionModel extends Model<IMission, {}, IMissionMethods> {}

export type Mission = HydratedDocument<IMission, IMissionMethods>;

export const MissionSchema: Schema = new Schema<IMission, {}, IMissionMethods>({
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
    }
});

const MissionModel = model<IMission, IMissionModel>('Mission', MissionSchema);

export { MissionModel };
