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

// Méthodes sur l'instance
interface IMissionsMethods {
    getMissions(user: User): Promise<Mission[] | Current>;
    confirmMission(n: Number): any
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
    if (this.current) {
        return this.current;
    }
    if (this.missions.length === 0) {
        let newMissions = [];

        for (let i = 0; i < 3; i++) {
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

            newMissions.push(mission);
        }

        this.missions = newMissions;
        await user.save();
        return this.missions;
    }
    return this.missions;
};

MissionsSchema.methods.confirmMission = async function (n: number, user: User, interaction: ButtonInteraction): Promise<string> {
    if (this.current) {
        return "Vous avez déjà une mission en cours.";
    }

    const mission = this.missions[n]
    this.current = {
        title: mission.title,
        desc: mission.desc,
        rank: mission.rank,
        time: mission.time,
        rewardXp: mission.rewardXp,
        rewardGold: mission.rewardGold,
        startAt: Date.now(),
        timeout_id: setTimeout(() => this.sendRewards(user, mission.rewardXp, mission.rewardGold, interaction), mission.time * 60 * 1000)
    };
    return `Vous avez décidé de réaliser la mission n°${n + 1}.`;
}

MissionsSchema.methods.stopCurrentMission = async function (): Promise<string> {
    if (!this.current) {
        return "Vous n'avez pas de mission en cours.";
    }

    clearTimeout(this.current.timeout_id)
    this.current = null;
    return `Vous avez décidé d'annuler la mission en cours.`;
}

MissionsSchema.methods.sendRewards = async function (user: User, xp: number, gold: number, msg: Message): Promise<any> {
    user.experience.total += xp
    user.gold += gold
    
    clearTimeout(this.current.timeout_id)
    this.current = null;
    await user.save()
    
    msg.channel.send(`Félicitations ${userMention(user.id)} ! Vous avez gagné ${xp} XP et ${gold} pièces d'or pour avoir terminé votre mission !`)
}