import { log } from 'node:console';
import { Fighter } from './Fighter';

export default class FightSystem {
    Attacker: Fighter;
    Defender: Fighter;
    turnCount: number = 1;
    intervalId: number | NodeJS.Timeout = 0;
    history: string[] = [];

    winner: Fighter | null;

    onUpdate?: (fight: FightSystem) => void;
    onEnd?: (fight: FightSystem) => void;

    constructor(
        player: Fighter,
        enemy: Fighter,
        onUpdate?: (fight: FightSystem) => void,
        onEnd?: (fight: FightSystem) => void,
    ) {
        if (Math.random() < 0.5) {
            this.Attacker = player;
            this.Defender = enemy;
        } else {
            this.Defender = player;
            this.Attacker = enemy;
        }

        this.onUpdate = onUpdate;
        this.onEnd = onEnd;

        this.winner = null;
    }

    public makeFight() {
        this.intervalId = setInterval(() => {
            this.makeTurn();

            if (this.onUpdate !== undefined) {
                this.onUpdate(this);
            }

            if (this.winner !== null) {
                clearInterval(this.intervalId);
                if (this.onEnd !== undefined) this.onEnd(this);
            }
        }, 2000);
    }

    public makeTurn() {
        let logCurrent = [];

        let attackDodged: boolean = this.isAttackDodged();
        if (!attackDodged) {
            const criticalMultiplier = this.isAttackCritical();
            logCurrent.push(this.attack(criticalMultiplier));
        } else {
            logCurrent.push(`${this.Defender.name} a esquivé l'attaque de ${this.Attacker.name}`);
        }

        let turnDoubled: boolean = this.isTurnDoubled();
        if (!turnDoubled) {
            this.switchPlayers();
        } else {
            logCurrent.push(`${this.Attacker.name} est trop rapide et rejoue.`);
        }

        this.history.push(logCurrent.join('\n'));

        if (this.Attacker.currentHealth > 0 && this.Defender.currentHealth > 0) {
            this.turnCount++;
        } else {
            this.winner = this.Attacker.currentHealth > 0 ? this.Attacker : this.Defender;
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

    // function qui évalue la puissance de l'attaque et enlève les points de l'ennemi, re tourne la string à ajouté dans l'historique
    public attack(critical: number): string {
        let damage = Math.max(0, this.Attacker.attributes.strength * critical - this.Defender.attributes.armor);
        this.Defender.currentHealth = Math.max(0, this.Defender.currentHealth - damage);

        return `${critical === 2 ? '**COUP CRITIQUE !!! **' : ''}${this.Attacker.name} a infligé ${damage} dommages à ${this.Defender.name}, il lui reste ${this.Defender.currentHealth} PV.`;
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
