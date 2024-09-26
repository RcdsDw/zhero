import { EmbedBuilder, TextChannel } from 'discord.js';
import { Fighter } from './Fighter';

export default class FightSystem {
    currentPlayer: Fighter;
    otherPlayer: Fighter;
    turnCount: number = 1;
    intervalId: number | NodeJS.Timeout = 0;
    rowBattle: string[] = [];
    embedMessage: EmbedBuilder;
    channel: TextChannel;

    constructor(currentPlayer: Fighter, otherPlayer: Fighter, channel: TextChannel) {
        this.currentPlayer = currentPlayer;
        this.otherPlayer = otherPlayer;
        this.channel = channel;
    }

    public async makeFight(player: Fighter, enemy: Fighter) {
        let res = this.whoIsFirst();
        if (res === 'player') {
            this.currentPlayer = player;
            this.otherPlayer = enemy;
        } else {
            this.currentPlayer = enemy;
            this.otherPlayer = player;
        }

        console.log("User:",player,"Enemy :",enemy )

        let embed = new EmbedBuilder()
            .setTitle(`${player.name} - ${player.currentHealth} VS ${enemy.name} - ${enemy.currentHealth}`)
            .setDescription('Que le meilleur gagne...')
            .addFields(
                { name: 'Tour', value: `${this.turnCount}`, inline: true },
                { name: 'Rapport de combat !', value: '...', inline: true}
            )
            .setColor('#ff0000');

        this.embedMessage = await this.channel.send({ embeds: [embed] });

        this.intervalId = setInterval(async () => {
            let isFinished: boolean = await this.makeTurn(player, enemy);
            if (isFinished) {
                clearInterval(this.intervalId);
                embed.setDescription(`${player.currentHealth <= 0 && enemy.currentHealth > 0 ? enemy.name : player.name} a gagné le combat!`);
                await this.embedMessage.edit({ embeds: [embed] });
            } else {
                this.updateEmbed(player, enemy);
            }
        }, 2000); 
    }

    public async updateEmbed(player: Fighter, enemy: Fighter) {
        const embed = this.embedMessage.embeds[0];
        embed.fields[1].value = this.rowBattle.slice(-5).join('\n');
        embed.fields[0].value = `[Tour ${this.turnCount}]`;
        embed.title.value = `${player.name} - ${player.currentHealth} VS ${enemy.name} - ${enemy.currentHealth}`;
        await this.embedMessage.edit({ embeds: [embed] });
    }

    public async makeTurn(player: Fighter, enemy: Fighter): Promise<boolean> {
        let attackDodged: boolean = await this.isAttackDodged();
        if (!attackDodged) {
            const criticalMultiplier = await this.isAttackCritical();
            this.attack(criticalMultiplier);
        } else {
            // remplacer par une interaction
            this.rowBattle.push((`${this.otherPlayer.name} a esquivé l'attaque.`));
        }

        let turnDoubled: boolean = await this.isTurnDoubled();
        if (!turnDoubled) {
            this.switchPlayers();
        } else {
            // remplacer par une interaction
            this.rowBattle.push((`${this.otherPlayer.name} est trop rapide et rejoue.`));
        }

        if(player.currentHealth > 0 && enemy.currentHealth > 0) {
            this.turnCount++;
            return false;
        } else {
            return true;
        }
    }

    // function qui determine le premier joueur (en random pour l'instant à changer avec de l'initiative surement)
    public whoIsFirst(): string {
        return Math.random() < 0.5 ? 'player' : 'enemy';
    }

    // function qui check si l'attaque est esquivée
    public async isAttackDodged(): Promise<boolean> {
        return Math.floor(Math.random() * 200) < this.otherPlayer.attributes.dodge;
    }

    // function qui check si l'attaque est un coup critique
    public async isAttackCritical(): Promise<number> {
        return Math.floor(Math.random() * 200) < this.currentPlayer.attributes.critical ? 2 : 1;
    }

    // function qui évalue la puissance de l'attaque et enlève les points de l'ennemi
    public attack(critical: number) {
        let damage = Math.max(0, this.currentPlayer.attributes.strength * critical - this.otherPlayer.attributes.armor);
        this.otherPlayer.currentHealth -= damage;
        this.rowBattle.push(`${critical === 2 ? '{{ COUP CRITIQUE !!! }}' : ''}${this.currentPlayer.name} a infligé ${damage} dommages à ${this.otherPlayer.name}, il lui reste ${this.otherPlayer.currentHealth} PV.`);
    }

    // function qui check la vitesse pour skip le tour de l'ennemi actuel
    public async isTurnDoubled(): Promise<boolean> {
        return Math.floor(Math.random() * 200) < this.currentPlayer.attributes.speed;
    }

    // function qui change le joueur actuel en autre et inversement
    public switchPlayers() {
        [this.currentPlayer, this.otherPlayer] = [this.otherPlayer, this.currentPlayer];
    }
}
