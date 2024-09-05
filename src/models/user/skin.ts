import { HydratedDocument, model, Model, Schema } from "mongoose";

export enum Gender {
    Women = 'Femme',
    Men = 'Homme'
}

// Données du document
export interface ISkin {
    [key: string]: any;
    gender : Gender;
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
    required : true
}

// Méthodes sur l'instance
interface ISkinMethods {
}

// Méthodes statiques
interface ISkinModel extends Model<ISkin, {}, ISkinMethods> {
    generateRandom() : SkinModule
}

export type SkinModule = HydratedDocument<ISkin, ISkinMethods>;

export const SkinSchema: Schema = new Schema<ISkin, {}, ISkinMethods>({
    gender: {
        type: String,
        enum : Gender,
        required : true
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

const SkinModel = model<ISkin, ISkinModel>('Skin', SkinSchema);

export { SkinModel };