import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { ButtonInteraction, userMention, Message } from 'discord.js';
import { Mission, MissionModel, MissionSchema } from './mission/mission';
import { Current, CurrentSchema } from './mission/current';
import { User } from './user';

import datas from '../../datas/missions.json';

interface IMissions {
    missions: Mission[];
    current: Current;
}

interface IMissionsMethods {
    getMissions(user: User): Promise<Mission[] | Current>;
    confirmMission(n: Number, user: User, callBack?: (xp: number, gold: number) => void): Promise<string>;
    stopCurrentMission(): string;
    sendRewards(user: User, callBack?: (xp: number, gold: number) => void): Promise<void>;
}

interface IMissionsModel extends Model<IMissions, object, IMissionsMethods> {
    static(): void;
}

export type Missions = HydratedDocument<IMissions, IMissionsMethods>;

export const MissionsSchema: Schema = new Schema<IMissions, object, IMissionsMethods>({
    missions: {
        type: [MissionSchema],
        required: true,
    },
    current: {
        type: CurrentSchema,
    },
});

const MissionsModel = model<IMissions, IMissionsModel>('Missions', MissionsSchema);

export { MissionsModel };

MissionsSchema.methods.getMissions = async function (user: User): Promise<Mission[] | Current> {
    if (this.current) {
        return this.current;
    }
    if (this.missions.length === 0) {
        for (let i = 0; i < 5; i++) {
            await this.createMission(user);
        }

        await user.save();
    }
    return this.missions;
};

MissionsSchema.methods.createMission = async function (user: User) {
    let data = datas[Math.floor(Math.random() * datas.length)];
    let time = data.rank * Math.floor(Math.random() * 100) + 100 * (data.rank - 1);

    let rewardXp = Math.floor(time * 0.507);
    let rewardGold = Math.floor((user.experience.level / 10) * (time / 50));

    let mission = await MissionModel.create({
        title: data.title,
        desc: data.description,
        rank: data.rank,
        time: time,
        rewardXp: rewardXp,
        rewardGold: rewardGold,
    });
    this.missions.push(mission);
};

MissionsSchema.methods.confirmMission = async function (
    n: string,
    user: User,
    callBack?: (xp: number, gold: number) => void,
): Promise<string> {
    if (this.current) {
        return 'Vous avez déjà une mission en cours.';
    }

    const mission = this.missions[n];
    this.current = {
        ...mission,
        startAt: Date.now(),
        timeout_id: setTimeout(() => this.sendRewards(user, callBack), mission.time * 60 * 1000),
    };
    this.missions.splice(n, 1);
    return `Vous avez décidé de réaliser la mission n°${parseInt(n) + 1}.`;
};

MissionsSchema.methods.stopCurrentMission = function (): string {
    if (!this.current) {
        return "Vous n'avez pas de mission en cours.";
    }

    clearTimeout(this.current.timeout_id);
    this.missions.push(this.current);
    this.current = null;
    return `Vous avez décidé d'annuler la mission en cours.`;
};

MissionsSchema.methods.sendRewards = async function (user: User, callBack?: (xp: number, gold: number) => void) {
    user.experience.add(this.current.rewardXp);
    user.gold += this.current.rewardGold;

    if (callBack) {
        callBack(this.current.xp, this.current.gold);
    }

    clearTimeout(this.current.timeout_id);
    await this.createMission(user);
    this.current = null;
};
