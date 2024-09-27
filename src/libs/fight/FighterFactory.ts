import { User } from '../../models/user/user';
import { User as DiscordUser } from 'discord.js';
import Mob from '../mobs/Mob';
import { Fighter } from './Fighter';

export default class FighterFactory {
    public static fromUser(user: User, discordUser: DiscordUser): Fighter {
        return new Fighter('USER', discordUser.username, user.getTotalAttributes());
    }

    public static fromMob(mob: Mob): Fighter {
        return new Fighter('MOB', mob.name, mob.attributes);
    }
}
