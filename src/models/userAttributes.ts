import { Schema } from "mongoose";

export interface IUserAttributes {
    strength : number,
    health : number,
    dexterity : number,
}

export const UserAttributesSchema : Schema = new Schema<IUserAttributes>({
    strength : {
        type : Number,
        required : true,
        default : 0
    },
    health : {
        type : Number,
        required : true,
        default : 0
    },
    dexterity : {
        type : Number,
        required : true,
        default : 0
    }
})
