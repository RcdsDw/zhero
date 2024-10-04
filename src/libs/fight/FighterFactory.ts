import { User } from '../../models/user/user';
import { User as DiscordUser } from 'discord.js';
import { Fighter } from './Fighter';
import { BaseMob } from '../../models/mob/baseMob';

export default class FighterFactory {
    public static async fromUser(user: User, discordUser: DiscordUser): Promise<Fighter> {
        return new Fighter('USER', discordUser.displayName, user.getTotalAttributes(), await user.getImage());
    }

    public static fromMob(mob: BaseMob): Fighter {
        return new Fighter('MOB', mob.name, mob.attributes, mob.skin);
    }
}
