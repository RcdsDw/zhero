import { HydratedDocument, model, Model, Schema } from 'mongoose';
import PartManager from '../../libs/montage/PartManager';

export enum Gender {
    Women = 'Femme',
    Men = 'Homme',
}

// Données du document
export interface ISkin {
    gender: Gender;
    color: number;
    eyes: number;
    eyebrows: number;
    hair: number;
    head: number;
    mouth: number;
    nose: number;
    decoration: number;
    facial_hair: number;
}

const schemaProperty = {
    type: Number,
    required: true,
};

// Méthodes sur l'instance
interface ISkinMethods {
    getImage(): Promise<string>;
    switchGender(): void;
    increaseAttribute(attribute: keyof ISkin): void;
    decreaseAttribute(attribute: keyof ISkin): void;
}

// Méthodes statiques
interface ISkinModel extends Model<ISkin, object, ISkinMethods> {
    static : () => void
}

export type SkinModule = HydratedDocument<ISkin, ISkinMethods>;

export const SkinSchema: Schema = new Schema<ISkin, object, ISkinMethods>({
    gender: {
        type: String,
        enum: Gender,
        required: true,
    },
    color: schemaProperty,
    eyes: schemaProperty,
    eyebrows: schemaProperty,
    hair: schemaProperty,
    head: schemaProperty,
    mouth: schemaProperty,
    nose: schemaProperty,
    decoration: schemaProperty,
    facial_hair: schemaProperty,
});

SkinSchema.methods.getImage = async function (): Promise<string> {
    return await PartManager.getImage(this as SkinModule);
};

SkinSchema.methods.switchGender = function () {
    if (this.gender === Gender.Women) {
        this.gender = Gender.Men;
    } else {
        this.gender = Gender.Women;
    }
};

SkinSchema.methods.increaseAttribute = function (attribute: keyof ISkin): void {
    if (typeof this[attribute] !== 'number') {
        return;
    }

    this[attribute] = PartManager.getPart(attribute)?.clamp(this[attribute] + 1, this.gender);
};

SkinSchema.methods.decreaseAttribute = function (attribute: keyof ISkin): void {
    if (typeof this[attribute] !== 'number') {
        return;
    }

    this[attribute] = PartManager.getPart(attribute)?.clamp(this[attribute] - 1, this.gender);
};

const SkinModel = model<ISkin, ISkinModel>('Skin', SkinSchema);

export { SkinModel };
