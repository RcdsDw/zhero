import { HydratedDocument, model, Model, Schema } from 'mongoose';

export interface IMission {
    title: string;
    desc: string;
    rank: number;
    time: number;
    rewardXp: number;
    rewardGold: number;
    type: 'TIME'|'FIGHT'
}

interface IMissionMethods {
    static(): void;
}

interface IMissionModel extends Model<IMission, object, IMissionMethods> {
    static(): void;
}

export type Mission = HydratedDocument<IMission, IMissionMethods>;

export const MissionSchema: Schema = new Schema<IMission, object, IMissionMethods>({
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
    rewardXp: {
        type: Number,
        required: true,
    },
    rewardGold: {
        type: Number,
        required: true,
    },
    type : {
        type : String,
        required : true,
    }
});

const MissionModel = model<IMission, IMissionModel>('Mission', MissionSchema);

export { MissionModel };
