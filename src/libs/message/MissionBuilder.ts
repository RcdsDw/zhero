import {
    ColorResolvable,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    BaseMessageOptions,
} from 'discord.js';
import { Mission } from '../../models/user/mission/mission';
import { User } from '../../models/user/user';
import { Fighter } from '../fight/Fighter';
import FightSystem from '../fight/FightSystem';
import FightBuilder from './FightBuilder';

export default class MissionBuilder {
    public static async showMissions(user: User): Promise<BaseMessageOptions> {
        const res = await user?.mission?.getMissions(user);
        const colors: ColorResolvable[] = ['Blue', 'Green', 'Yellow', 'Orange', 'Red'];

        if ('startAt' in res) {
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                    .setLabel(`Annuler`)
                    .setCustomId(`MissionsButton-missionStop`)
                    .setStyle(ButtonStyle.Danger),
            );

            const embed = new EmbedBuilder()
                .setTitle(`En cours : ${res.title}`)
                .addFields({
                    name: `${res.desc}`,
                    value:
                        `\n\nNiveau: ${res.rank} / Temps restant: ${res.getRemainingTime()}\n\n` +
                        `Récompenses : ${res.rewardXp} 🦸‍♂️ / ${res.rewardGold} 🪙`,
                })
                .setColor('White');

            if (res.type === 'TIME') {
                embed.setAuthor({
                    name: 'Temps',
                    iconURL: 'https://cdn-icons-png.flaticon.com/512/148/148855.png',
                });
            } else {
                embed.setAuthor({
                    name: 'Combat',
                    iconURL: 'https://cdn-icons-png.flaticon.com/512/5022/5022167.png',
                });
            }

            return {
                content: '# Mission en cours',
                embeds: [embed],
                components: [row],
                files: [],
            };
        } else {
            const missions = res as Mission[];
            const embeds: EmbedBuilder[] = [];
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();

            missions.forEach((mission, i) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Mission ${i + 1} : ${mission.title}`)
                    .addFields({
                        name: `${mission.desc}`,
                        value:
                            `Niveau: ${mission.rank}` +
                            ` / Temps: ${Math.floor(mission.time / 60)}h${mission.time % 60}m\n\n` +
                            `Récompenses : ${mission.rewardXp} 🦸‍♂️ / ${mission.rewardGold} 🪙`,
                    })
                    .setColor(colors[mission.rank - 1]);

                if (mission.type === 'TIME') {
                    embed.setAuthor({
                        name: 'Temps',
                        iconURL: 'https://cdn-icons-png.flaticon.com/512/148/148855.png',
                    });
                } else {
                    embed.setAuthor({
                        name: 'Combat',
                        iconURL: 'https://cdn-icons-png.flaticon.com/512/5022/5022167.png',
                    });
                }

                row.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${i + 1}`)
                        .setCustomId(`MissionsButton-${i}`)
                        .setStyle(ButtonStyle.Success),
                );
                embeds.push(embed);
            });

            return {
                content: '# Mission possibles',
                embeds: embeds,
                components: [row],
                files: [],
            };
        }
    }

    public static async getFightEmbed(
        player1: Fighter,
        player2: Fighter,
        fight: FightSystem,
        bg?: string,
    ): Promise<BaseMessageOptions> {
        const res = await FightBuilder.getEmbed(player1, player2, fight, bg);

        if (res.embeds && res.embeds[0] instanceof EmbedBuilder) {
            res.embeds[0].setDescription('Combat pour une mission');
        }

        return res;
    }
}
