import { HydratedDocument, model, Model, Schema } from 'mongoose';

interface IMission {
    title: string;
    desc: string;
    rank: string;
}

// Méthodes sur l'instance
interface IMissionMethods {}

interface IMissionModel extends Model<IMission, {}, IMissionMethods> {}

export type MissionModule = HydratedDocument<IMission, IMissionMethods>;

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
        type: String,
        required: true,
    },
});

const MissionModel = model<IMission, IMissionModel>('Mission', MissionSchema);

export { MissionModel };
