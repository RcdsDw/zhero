import { EmbedBuilder } from "discord.js";
import FightSystem from "../fight/FightSystem";
import { Fighter } from "../fight/Fighter";


export default class FightBuilder {
    public static getEmbed(player1 : Fighter, player2 : Fighter, fight : FightSystem) : EmbedBuilder {
        const embed = new EmbedBuilder();
        embed.setTitle(`${player1.name} - ${player1.currentHealth} PV vs ${player2.name} - ${player2.currentHealth} PV`);

        embed.addFields({
            name : 'Tour',
            value : ' ',
            inline : true
        },
        {
            name : 'Rapport de combat',
            value : ' ',
            inline : true
        },
        {
            name : ' ',
            value : ' ',
            inline : true
        }
        )

        fight.history.slice(-5).map((label, index) => {
            let turn = fight.turnCount - (Math.min(5, fight.turnCount - 1) - index)

            embed.addFields(
                {
                    name : turn.toString(),
                    value : ' ',
                    inline : true
                },
                {
                    name : ' ',
                    value : label,
                    inline : true
                },
                {
                    name : ' ',
                    value : ' ',
                    inline : true
                }
            )
        })

        if(fight.winner !== null) {
            embed.addFields({
                name : `🏆 ${fight.winner.name} 🏆 à gagné le combat`,
                value : " "
            })
        } else {
            embed.addFields(
                {
                    name : '...',
                    value : ' ',
                }
            )
        }

        return embed;
    }
}