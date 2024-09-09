import { EmbedBuilder } from 'discord.js';
import { Mission } from '../../models/user/missions';

export default class MissionBuilder {
    public static showMissions(missions: Mission[]): EmbedBuilder {
        const embed = new EmbedBuilder().setTitle('Missions actuelles');

        const fields = missions.map((mission, i) => ({
            name: `Mission ${i + 1} : ${mission.title}`,
            value: `${mission.desc}\n\nNiveau: ${mission.rank}` +
            ` / Temps: ${Math.floor((parseInt(mission.rank) * (Math.random() * 100)) / 60)}h${(parseInt(mission.rank) * Math.floor(Math.random() * 100)) % 60}`,
        }));

        embed.addFields(fields);

        return embed;
    }
}
