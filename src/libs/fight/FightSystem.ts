import { Fighter } from './Fighter';

export default class FightSystem {
    currentPlayer;
    otherPlayer;

    constructor(currentPlayer: Fighter, otherPlayer: Fighter) {
        this.currentPlayer = currentPlayer;
        this.otherPlayer = otherPlayer;
    }

    public async makeFight(player: Fighter, enemy: Fighter): Promise<boolean> {
        console.log('je suis là')
        let turnCount: number = 0;

        let res = this.whoIsFirst();
        if (res === 'player') {
            this.currentPlayer = player;
            this.otherPlayer = enemy;
        } else {
            this.currentPlayer = enemy;
            this.otherPlayer = player;
        }

        while (player.currentHealth > 0 && enemy.currentHealth > 0) {
            let attackDodged: boolean = await this.isAttackDodged();
            if (!attackDodged) {
                const criticalMultiplier = await this.isAttackCritical();
                this.attack(criticalMultiplier)
            } else {
                // remplacer par une interaction
                console.log(`${this.otherPlayer} a esquivé l'attaque.`);
            }

            let turnDoubled: boolean = await this.isTurnDoubled();
            if (!turnDoubled) {
                this.switchPlayers();
            } else {
                // remplacer par une interaction
                console.log(`${this.otherPlayer} est trop rapide et rejoue.`); // remplacer le .name par le nom de discord en allant chercher avec l'id
            }

            turnCount++;
        }

        return player.currentHealth > 0;
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
    public attack(critical: number): string {
        let damage = Math.max(0, this.currentPlayer.attributes.strength * critical - this.otherPlayer.attributes.armor);
        this.otherPlayer.currentHealth -= damage;
        console.log('il attaque')
        return `${critical === 2 ? 'COUP CRITIQUE !!! ' : ''}${this.currentPlayer} a infligé ${damage} dommages à ${this.otherPlayer}, il lui reste ${this.otherPlayer.currentHealth} PV.`; // remplacer le .name par le nom de discord en allant chercher avec l'id
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
