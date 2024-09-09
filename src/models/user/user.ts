import { User as DiscordUser } from 'discord.js';
import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { ExperienceModule, ExperienceSchema } from './experience';
import { AttributesModule, AttributesSchema } from './attributes';
import { SkinModule, SkinSchema } from './skin';
import PartManager from '../../libs/montage/PartManager';
import { Mission, MissionSchema } from './missions';

// Données du document
interface IUser {
    id: string;
    gold: number;
    experience: ExperienceModule;
    attributes: AttributesModule;
    skin: SkinModule;
    missions: Mission[];
}

// Méthodes sur l'instance
interface IUserMethods {
    static : () => void
}

// Méthodes statiques
interface IUserModel extends Model<IUser, object, IUserMethods> {
    findByDiscordUser(user: DiscordUser): Promise<User | null>;
}

export type User = HydratedDocument<IUser, IUserMethods>;

const UserSchema: Schema = new Schema<IUser, object, IUserMethods>(
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
        skin: {
            type: SkinSchema,
            required: true,
            default: PartManager.getRandomSkin(),
        },
        missions: {
            type: [MissionSchema],
            required: true,
            default: () => [],
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
