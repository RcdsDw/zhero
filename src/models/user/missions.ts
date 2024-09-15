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
    confirmMission(n: Number): string;
    stopCurrentMission(): string;
    sendRewards(user: User, xp: number, gold: number, msg: Message): void;
}

interface IMissionsModel extends Model<IMissions, object, IMissionsMethods> {
    static(): void
}

export type Missions = HydratedDocument<IMissions, IMissionsMethods>;

export const MissionsSchema: Schema = new Schema<IMissions, object, IMissionsMethods>({
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
    if (this.current) {
        return this.current;
    }
    if (this.missions.length === 0) {
        for (let i = 0; i < 5; i++) {
            await this.createMission(user);
        }
        return this.missions;
    }
    return this.missions;
};

MissionsSchema.methods.createMission = async function (user: User) {
    let data = datas[Math.floor(Math.random() * datas.length)];
    let time = (data.rank * Math.floor(Math.random() * 100)) + 100 * (data.rank - 1)

    let rewardXp = Math.floor((user.experience.level * 0.7) * time)
    let rewardGold = Math.floor((user.experience.level / 2) * (time / 2))

    let mission = await MissionModel.create({
        title: data.title,
        desc: data.description,
        rank: data.rank,
        time: time,
        rewardXp: rewardXp,
        rewardGold: rewardGold
    });
    this.missions.push(mission);
    await user.save();
}

MissionsSchema.methods.confirmMission = async function (n: string, user: User, interaction: ButtonInteraction): Promise<string> {
    if (this.current) {
        return "Vous avez déjà une mission en cours.";
    }

    const mission = this.missions[n]
    this.current = {
        ...mission,
        startAt: Date.now(),
        timeout_id: setTimeout(() => this.sendRewards(user, mission.rewardXp, mission.rewardGold, interaction), mission.time * 60 * 1000)
    };
    this.missions.splice(n, 1);
    await user.save()
    return `Vous avez décidé de réaliser la mission n°${parseInt(n) + 1}.`;
}

MissionsSchema.methods.stopCurrentMission = async function (): Promise<string> {
    if (!this.current) {
        return "Vous n'avez pas de mission en cours.";
    }

    clearTimeout(this.current.timeout_id)
    this.missions.push(this.current)
    this.current = null;
    return `Vous avez décidé d'annuler la mission en cours.`;
}

MissionsSchema.methods.sendRewards = async function (user: User, xp: number, gold: number, msg: Message) {
    user.experience.add(xp)
    user.gold += gold
    
    clearTimeout(this.current.timeout_id)
    await this.createMission(user)
    this.current = null;
    await user.save()
    
    msg.channel.send(`Félicitations ${userMention(user.id)} ! Vous avez gagné ${xp} XP et ${gold} pièces d'or pour avoir terminé votre mission !`)
}