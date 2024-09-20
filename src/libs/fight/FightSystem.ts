import { User } from "../../models/user/user";

export async function makeFight(player: User, ennemy: User): Promise<Boolean> {
    let firstPlayer: any;
    let turnCount: number = 0;

    let res = whoIsFirst()
    if (res === "player") {
        firstPlayer = player
    } else {
        firstPlayer = ennemy
    }

    do while (player.health > 0 && ennemy.health > 0) {
        let currentPlayer: any;

        if (turnCount === 0) {
            currentPlayer = firstPlayer
        }

        attack(currentPlayer)
        turnCount ++
    }
    return false
}

function whoIsFirst(): String {
    let randNb = Math.floor(Math.random() * 100)

    if (randNb < 50) {
        return "player"
    } else {
        return "enemy"
    }
}

function attack(user) {

}
