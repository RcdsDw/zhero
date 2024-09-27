import { EmbedBuilder, TextChannel } from 'discord.js';
import { Fighter } from './Fighter';

export default class FightSystem {
    Attacker: Fighter;
    Defender: Fighter;
    turnCount: number = 1;
    intervalId: number | NodeJS.Timeout = 0;
    rowBattle: string[] = [];
    embedMessage: EmbedBuilder;
    channel: TextChannel;

    constructor(Attacker: Fighter, Defender: Fighter, channel: TextChannel) {
        this.Attacker = Attacker;
        this.Defender = Defender;
        this.channel = channel;
    }

    public async makeFight(player: Fighter, enemy: Fighter) {
        this.setFirstPlayer(player, enemy);

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
            let isFinished: boolean = await this.makeTurn();
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

    public async makeTurn(): Promise<boolean> {
        let attackDodged: boolean = this.isAttackDodged();
        if (!attackDodged) {
            const criticalMultiplier = this.isAttackCritical();
            this.attack(criticalMultiplier);
        } else {
            // remplacer par une interaction
            this.rowBattle.push((`${this.Defender.name} a esquivé l'attaque.`));
        }

        let turnDoubled: boolean = this.isTurnDoubled();
        if (!turnDoubled) {
            this.switchPlayers();
        } else {
            // remplacer par une interaction
            this.rowBattle.push((`${this.Defender.name} est trop rapide et rejoue.`));
        }

        if(this.Attacker.currentHealth > 0 && this.Defender.currentHealth > 0) {
            this.turnCount++;
            return false;
        } else {
            return true;
        }
    }

    // function qui determine le premier joueur (en random pour l'instant à changer avec de l'initiative surement)
    public setFirstPlayer(player: Fighter, enemy: Fighter) {
        if (Math.random() < 0.5) {
            this.Attacker = player;
            this.Defender = enemy;
        } else {
            this.Defender = player;
            this.Attacker = enemy;
        }
    }

    // function qui check si l'attaque est esquivée
    public isAttackDodged(): boolean {
        return Math.floor(Math.random() * 200) < this.Defender.attributes.dodge;
    }

    // function qui check si l'attaque est un coup critique
    public isAttackCritical(): number {
        return Math.floor(Math.random() * 200) < this.Attacker.attributes.critical ? 2 : 1;
    }

    // function qui évalue la puissance de l'attaque et enlève les points de l'ennemi
    public attack(critical: number) {
        let damage = Math.max(0, this.Attacker.attributes.strength * critical - this.Defender.attributes.armor);
        this.Defender.currentHealth -= damage;
        this.rowBattle.push(`${critical === 2 ? '{{ COUP CRITIQUE !!! }}' : ''}${this.Attacker.name} a infligé ${damage} dommages à ${this.Defender.name}, il lui reste ${this.Defender.currentHealth} PV.`);
    }

    // function qui check la vitesse pour skip le tour de l'ennemi actuel
    public isTurnDoubled(): boolean {
        return Math.floor(Math.random() * 200) < this.Attacker.attributes.speed;
    }

    // function qui change le joueur actuel en autre et inversement
    public switchPlayers() {
        [this.Attacker, this.Defender] = [this.Defender, this.Attacker];
    }
}
