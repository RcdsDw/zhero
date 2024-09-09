import { EmbedBuilder } from 'discord.js';
import { User } from '../../models/user/user';

export default class UserBuilder {
    public static profile(user: User): EmbedBuilder {
        return new EmbedBuilder().setTitle('Votre profile').addFields(
            {
                name: 'Level',
                value: `${user.experience.level} (${user.experience.progression.toFixed(2)} %)`,
                inline: true,
            },
            {
                name: 'Or  🪙',
                value: user.gold.toString(),
                inline: true,
            },
        );
    }
}
