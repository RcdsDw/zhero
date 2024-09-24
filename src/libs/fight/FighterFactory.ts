import { User } from '../../models/user/user';
import Mob from '../mobs/Mob';
import { Fighter } from './Fighter';

export default class FighterFactory {
    public static fromUser(user: User): Fighter {
        return new Fighter('USER', user.getTotalAttributes());
    }

    public static fromMob(mob: Mob): Fighter {
        return new Fighter('MOB', mob.attributes);
    }
}
