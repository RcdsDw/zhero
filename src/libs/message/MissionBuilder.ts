import { ColorResolvable, EmbedBuilder, InteractionReplyOptions, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CurrentModel } from '../../models/user/mission/current';
import { Mission } from '../../models/user/mission/mission';
import { User } from '../../models/user/user';

export default class MissionBuilder {
    public static async showMissions(user: User): Promise<InteractionReplyOptions> {
        const res = await user?.mission?.getMissions(user);
        const colors: ColorResolvable[] = ['Blue', 'Green', 'Yellow', 'Orange', 'Red']
        const buttons: ActionRowBuilder<ButtonBuilder>[] = [];

        if (res instanceof CurrentModel) {
            const embed = new EmbedBuilder()
                .setTitle(`En cours : ${res.title}`)
                .addFields({
                    name: `${res.desc}`,
                    value: `${res.desc}\n\nNiveau: ${res.rank} / Temps restant: ${res.getRemainingTime()}\n\n` +
                    `Récompenses : ${Math.floor((user.experience.level * 0.7) * res.time)} 🦸‍♂️ / ${(user.experience.level / 2) * (res.time / 2)} 🪙`
                })
                .setColor('White')
                buttons[3]?.setComponents(
                    new ButtonBuilder()
                    .setLabel(`Annuler`)
                    .setCustomId(`MissionsButton-missionStop`)
                    .setStyle(ButtonStyle.Danger)
                );
        
            return {
                content: '# Mission en cours',
                embeds: [embed],
            };
        } else {
            const missions = res as Mission[];
            const embeds: EmbedBuilder[] = [];

            missions.forEach((mission, i) => {
                const embed = new EmbedBuilder().setTitle(`Mission ${i + 1} : ${mission.title}`)
                .addFields({
                    name: `${mission.desc}`,
                    value: `Niveau: ${mission.rank}` +
                    ` / Temps: ${Math.floor(mission.time / 60)}h${mission.time % 60}m\n\n` +
                    `Récompenses : ${Math.floor((user.experience.level * 0.7) * mission.time)} 🦸‍♂️ / ${(user.experience.level / 2) * (mission.time / 2) } 🪙`
                })
                .setColor(colors[i])
                buttons[i]?.setComponents(
                    new ButtonBuilder()
                    .setLabel(`${i}`)
                    .setCustomId(`MissionsButton-mission${i}`)
                    .setStyle(ButtonStyle.Success)
                )
                embeds.push(embed);
            });

            return {
                content: '# Mission possibles',
                embeds: embeds,
            };
        }
    }
}
