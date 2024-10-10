import {
    EmbedBuilder,
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    BaseMessageOptions,
    User as DiscordUser
} from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { User } from '../../models/user/user';
import mobs from '../../datas/tower.json'

export default class TowerBuilder {
    public static async getEmbed(user: User, discordUser: DiscordUser): Promise<BaseMessageOptions> {
        const towerInfo = user.tower.getTowerInfo();

        // get current mob
        const npcs: Object[] = []
        const boss: Object[] = []

        mobs.map((mob) => mob.type === "BOSS" ? boss.push(mob) : npcs.push(mob))

        const currentMob: Object = towerInfo.isBigStage === true ? boss[(towerInfo.currentStage / 10) - 1] : npcs[towerInfo.currentStage - 1]

        // canvas
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        // const bg = "https://img.freepik.com/premium-vector/dark-back-street-alley-with-door-bar-trash-can-car-with-open-trunk-night_273525-1119.jpg?semt=ais_hybrid"
        const bg = "images/assets/other_bg.jpg"
        const bgPath = await loadImage(bg);
        const mobPath = await loadImage(currentMob.skin);

        ctx.drawImage(bgPath, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(mobPath, 300, 75, 200, 350);

        const buffer = canvas.toBuffer();
        const file = new AttachmentBuilder(buffer, {name: "tower-and-mob.png"});

        const logo: string =
        'https://img.freepik.com/free-vector/cute-boy-super-hero-flying-cartoon-vector-icon-illustration-people-holiday-icon-concept-isolated_138676-5451.jpg';
        
        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
            .setLabel(`Se battre`)
            .setCustomId(`TowerButton-${currentMob.name}-tower-${bg}`)
            .setStyle(ButtonStyle.Success),
        );
        
        const embed = new EmbedBuilder()
            .setTitle(`La tour de la terreur - ${towerInfo.currentStage} / ${towerInfo.maxStage}`)
            .setDescription(`C'est à toi de jouer ${discordUser.displayName}, ta quête pour devenir un héros continue...`)
            .setImage('attachment://tower-and-mob.png')
            .addFields(
                {
                    name: `Votre prochain adversaire est : `,
                    value: `${currentMob.type === "BOSS" ? "🛑 BOSS 🛑 \n" : ""}Nom : ${currentMob.name} \n Niveau : ${currentMob.lvl}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({ text: "L'équipe ZHero", iconURL: logo })

            return {
                embeds: [embed],
                components: [row],
                files: [file],
            };
    }
}