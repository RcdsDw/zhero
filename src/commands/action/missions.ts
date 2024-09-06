import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserModel } from '../../models/user/user';
import { MissionModel } from '../../models/user/missions';

import datas from '../../datas/missions.json';
import MissionBuilder from '../../libs/embed/MissionBuilder';

export const data = new SlashCommandBuilder().setName('missions').setDescription('Voir les missions disponibles');

export async function execute(interaction: CommandInteraction) {
    let user = await UserModel.findByDiscordUser(interaction.user);

    if (user === null) {
        interaction.reply('Veuillez vous créer un compte pour commencer à faire vos preuves.');
        return;
    }

    if (user.missions === null) {
        let newMissions = [];

        for (let i = 0; i < 3; i++) {
            let data = datas[Math.floor(Math.random() * datas.length)];
            let mission = await MissionModel.create({
                title: data.title,
                desc: data.description,
                rank: data.rank,
            });

            newMissions.push(mission);
        }

        interaction.reply({
            embeds: [MissionBuilder.showMissions(newMissions)],
        });
    } else {
        interaction.reply({
            embeds: [MissionBuilder.showMissions(user?.missions)],
        });
    }
}
