import { User } from "../../models/user/user";

export async function makeFight(player: User, ennemy: User): Promise<Boolean> {
    let playerTurn: Boolean = false
    let ennemyTurn: Boolean = false
    let res = whoIsFirst()
    if (res === "player") {
        playerTurn = true
    } else {
        ennemyTurn = true
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