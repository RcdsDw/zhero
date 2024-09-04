import { User as DiscordUser } from "discord.js";
import { model, Model, Schema } from "mongoose";
import { UserAttributesSchema, IUserAttributes } from "./userAttributes";

interface IUser {
    id : string,
    gold : number,
    xp : number,
    attributes : IUserAttributes
}

// Méthodes sur l'instance
interface IUserDocument extends IUser, Document {
    
}

// Méthodes statiques
interface IUserModel extends Model<IUserDocument> {
    findByDiscordUser(user : DiscordUser) : Promise<IUser|null>
}

const UserSchema : Schema = new Schema<IUserDocument>({
    id : {
        type : String,
        required : true,
        unique : true
    },
    gold : {
        type : Number,
        required : true,
        default : 0
    },
    xp : {
        type : Number,
        required : true,
        default : 0
    },
    attributes : {
        type : UserAttributesSchema,
        required : true,
        default: () => ({}) // On doit mettre ça pour que ça prenne les valeurs par défaut du schéma enfant
    }
}, {
    timestamps : true,
})

UserSchema.statics.findByDiscordUser = async (user : DiscordUser) : Promise<IUser|null> => {
    return await User.findOne({
        id : user.id
    });
}

const User = model<IUserDocument, IUserModel>('User', UserSchema);

export { User };