import { HydratedDocument, Schema } from "mongoose";

enum Gender {
    Women = 'Femme',
    Men = 'Homme'
}

// Données du document
interface ISkin {
    genre : Gender;
    color : number;
    eyes : number;
    eyebrows : number;
    hair : number;
    head : number;
    mouth : number;
    nose :  number;
    decoration : number;
    facial_hair : number;
}

const schemaProperty = {
    type : Number,
    required : true,
    default : 1
}

// Méthodes sur l'instance
interface ISkinMethods {
}

export type SkinModule = HydratedDocument<ISkin, ISkinMethods>;

export const SkinSchema: Schema = new Schema<ISkin, {}, ISkinMethods>({
    genre: {
        type: String,
        enum : Gender,
        required : true,
        default : Gender.Men
    },
    color : schemaProperty,
    eyes : schemaProperty,
    eyebrows : schemaProperty,
    hair : schemaProperty,
    head : schemaProperty,
    mouth : schemaProperty,
    nose : schemaProperty,
    decoration : schemaProperty,
    facial_hair : schemaProperty
});