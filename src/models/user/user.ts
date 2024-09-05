import { User as DiscordUser } from 'discord.js';
import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { ExperienceModule, ExperienceSchema } from './experience';
import { AttributesModule, AttributesSchema } from './attributes';

// Données du document
interface IUser {
    id: string;
    gold: number;
    experience: ExperienceModule;
    attributes: AttributesModule;
}

// Méthodes sur l'instance
interface IUserMethods {}

// Méthodes statiques
interface IUserModel extends Model<IUser, {}, IUserMethods> {
    findByDiscordUser(user: DiscordUser): Promise<User | null>;
}

export type User = HydratedDocument<IUser, IUserMethods>;

const UserSchema: Schema = new Schema<IUser, {}, IUserMethods>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        gold: {
            type: Number,
            required: true,
            default: 0,
        },
        experience: {
            type: ExperienceSchema,
            required: true,
            default: () => ({}),
        },
        attributes: {
            type: AttributesSchema,
            required: true,
            default: () => ({}), // On doit mettre ça pour que ça prenne les valeurs par défaut du schéma enfant
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.statics.findByDiscordUser = async (user: DiscordUser): Promise<User | null> => {
    return await UserModel.findOne({
        id: user.id,
    });
};

const UserModel = model<IUser, IUserModel>('User', UserSchema);

export { UserModel };
