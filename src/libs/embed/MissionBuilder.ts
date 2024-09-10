import { EmbedBuilder } from 'discord.js';
import { CurrentModel } from '../../models/user/mission/current';
import { Mission } from '../../models/user/mission/mission';
import { User } from '../../models/user/user';

export default class MissionBuilder {
    public static showMissions(user: User): EmbedBuilder {
        const res = user?.mission?.getMissions();
        if (res instanceof CurrentModel) {
            return new EmbedBuilder().setTitle('Mission en cours').addFields({
                name: `En cours : ${res.title}`,
                value: `${res.desc}\n\nNiveau: ${res.rank} / Temps restant: ${res.getRemainingTime()}`
            });
        } else {
            const missions = res as Mission[];
            const embed = new EmbedBuilder().setTitle('Mission possibles')

            const fields = missions?.map((mission, i) => ({
                name: `Mission ${i + 1} : ${mission.title}`,
                value: `${mission.desc}\n\nNiveau: ${mission.rank}` +
                ` / Temps: ${Math.floor(mission.time / 60)}h${mission.time % 60}m`
            }));

            embed.addFields(fields);

            // return 3 embed différents

        return embed;
        }
    }
}
