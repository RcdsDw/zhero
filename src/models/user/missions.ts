import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { Mission, MissionModel, MissionSchema } from './mission/mission';
import { Current, CurrentSchema } from './mission/current';
import { User } from './user';

import datas from '../../datas/missions.json';

interface IMissions {
    missions: Mission[];
    current: Current;
}

// Méthodes sur l'instance
interface IMissionsMethods {
    getMissions(): Mission[] | Current;
}

interface IMissionsModel extends Model<IMissions, {}, IMissionsMethods> {}

export type Missions = HydratedDocument<IMissions, IMissionsMethods>;

export const MissionsSchema: Schema = new Schema<IMissions, {}, IMissionsMethods>({
    missions: {
        type: [MissionSchema],
        required: true,
    },
    current: {
        type: CurrentSchema,
    }
});

const MissionsModel = model<IMissions, IMissionsModel>('Missions', MissionsSchema);

export { MissionsModel };

MissionsSchema.methods.getMissions = async function (user: User): Promise<Mission[] | Current> {
    if (this.missions.length === 0) {
        let newMissions = [];

        for (let i = 0; i < 3; i++) {
            let data = datas[Math.floor(Math.random() * datas.length)];
            let mission = await MissionModel.create({
                title: data.title,
                desc: data.description,
                rank: data.rank,
                time: data.rank * Math.floor(Math.random() * 100),
            });

            newMissions.push(mission);
        }

        this.missions = newMissions;
        await user.save();
    } 
    if (this.current) {
        return this.current;
    }
    return this.missions;
};