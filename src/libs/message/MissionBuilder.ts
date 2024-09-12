import { ColorResolvable, EmbedBuilder, InteractionReplyOptions, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CurrentModel } from '../../models/user/mission/current';
import { Mission } from '../../models/user/mission/mission';
import { User } from '../../models/user/user';

export default class MissionBuilder {
    public static async showMissions(user: User): Promise<InteractionReplyOptions> {
        const res = await user?.mission?.getMissions(user);
        const colors: ColorResolvable[] = ['Blue', 'Green', 'Yellow', 'Orange', 'Red']
       
        if (res instanceof CurrentModel) {
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(
                    new ButtonBuilder()
                    .setLabel(`Annuler`)
                    .setCustomId(`MissionsButton-missionStop`)
                    .setStyle(ButtonStyle.Danger)
                );

            const embed = new EmbedBuilder()
                .setTitle(`En cours : ${res.title}`)
                .addFields({
                    name: `${res.desc}`,
                    value: `${res.desc}\n\nNiveau: ${res.rank} / Temps restant: ${res.getRemainingTime()}\n\n` +
                    `Récompenses : ${Math.floor((user.experience.level * 0.7) * res.time)} 🦸‍♂️ / ${(user.experience.level / 2) * (res.time / 2)} 🪙`
                })
                .setColor('White')
        
            return {
                content: '# Mission en cours',
                embeds: [embed],
                components: [row],
            };
        } else {
            const missions = res as Mission[];
            const embeds: EmbedBuilder[] = [];
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();

            missions.forEach((mission, i) => {
                const embed = new EmbedBuilder().setTitle(`Mission ${i + 1} : ${mission.title}`)
                .addFields({
                    name: `${mission.desc}`,
                    value: `Niveau: ${mission.rank}` +
                    ` / Temps: ${Math.floor(mission.time / 60)}h${mission.time % 60}m\n\n` +
                    `Récompenses : ${Math.floor((user.experience.level * 0.7) * mission.time)} 🦸‍♂️ / ${(user.experience.level / 2) * (mission.time / 2) } 🪙`
                })
                .setColor(colors[mission.rank - 1])
                row.addComponents(
                    new ButtonBuilder()
                    .setLabel(`${i + 1}`)
                    .setCustomId(`MissionsButton-mission${i}`)
                    .setStyle(ButtonStyle.Success)
                )
                embeds.push(embed);
            });

            return {
                content: '# Mission possibles',
                embeds: embeds,
                components: [row],
            };
        }
    }
}
