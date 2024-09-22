import { User } from "../../models/user/user";

let currentPlayer: User;
let otherPlayer: User;

export async function makeFight(player: User, enemy: User): Promise<boolean> {
    let turnCount: number = 0;

    let res = whoIsFirst()
    if (res === "player") {
        currentPlayer = player
        otherPlayer = enemy
    } else {
        currentPlayer = enemy
        otherPlayer = player
    }


    while (player.health > 0 && enemy.health > 0) {
        let attackDodged: boolean = await isAttackDodged(otherPlayer);
        if (!attackDodged) {
            const criticalMultiplier = await isAttackCritical(currentPlayer)
            attack(currentPlayer, criticalMultiplier, otherPlayer)
        } else {
            console.log(`${otherPlayer.name} a esquivé l'attaque.`)
        }

        let turnDoubled: boolean = await isTurnDoubled(currentPlayer);
        if (!turnDoubled) {
            switchPlayers(player, enemy)
        } else {
            console.log(`${otherPlayer.name} est trop rapide et rejoue.`) // remplacer le .name par le nom de discord en allant chercher avec l'id
        }

        turnCount ++
    } 

    return player.health > 0;
}

// function qui determine le premier joueur (en random pour l'instant à changer avec de l'initiative surement)
function whoIsFirst(): string {
    return Math.random() < 0.5 ? "player" : "enemy";
}

// function qui check si l'attaque est esquivée
async function isAttackDodged(otherPlayer: User): Promise<boolean> {
    return Math.floor(Math.random() * 200) < otherPlayer.dodge;
}


// function qui check si l'attaque est un coup critique
async function isAttackCritical(currentPlayer: User): Promise<number> {
    return Math.floor(Math.random() * 200) < currentPlayer.critical ? 2 : 1;
}


// function qui évalue la puissance de l'attaque et enlève les points de l'ennemi
function attack(currentPlayer: User, critical: number, otherPlayer: User): string {
    let damage = Math.max(0, (currentPlayer.strength * critical) - otherPlayer.armor)
    otherPlayer.health -= damage
    return `${critical === 2 ? "COUP CRITIQUE !!! " : ""}${currentPlayer.name} a infligé ${damage} dommages à ${otherPlayer.name}, il lui reste ${otherPlayer.health} PV.` // remplacer le .name par le nom de discord en allant chercher avec l'id
}

// function qui check la vitesse pour skip le tour de l'ennemi actuel
async function isTurnDoubled(currentPlayer: User): Promise<boolean> {
    return Math.floor(Math.random() * 200) < currentPlayer.speed
}

// function qui change le joueur actuel en autre et inversement
function switchPlayers(player: User, enemy: User) {
    [currentPlayer, otherPlayer] = currentPlayer === player ? [enemy, player] : [player, enemy];
}
