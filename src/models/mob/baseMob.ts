import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { AttributesModule, AttributesSchema } from '../user/attributes';
import * as fs from 'fs';
import * as path from 'path';
import ItemType from '../../enum/itemType';
import { translate } from '@vitalets/google-translate-api';

// Données du document
export interface IBaseMob {
    name: string;
    level: number;
    skin : string,
    type: 'NORMAL'|'BOSS';
    attributes: AttributesModule;
}

// Méthodes sur l'instance
interface IBaseMobMethods {
    static: () => void;
}

// Méthodes statiques
interface IBaseMobModel extends Model<IBaseMob, object, IBaseMobMethods> {
    populateDb(force: boolean, limit?: number): Promise<void>;
    createFromFile(fileName : string, type : "NORMAL"|"BOSS", level : number) : Promise<BaseMob>;
    findByLevelAround(level: number): Promise<BaseMob>;
}

export type BaseMob = HydratedDocument<IBaseMob, IBaseMobMethods>;

export const BaseMobSchema: Schema = new Schema<IBaseMob, object, IBaseMobMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        level : {
            type : Number,
            required : true
        },
        skin: {
            type: String,
            required: true,
        },
        type : {
            type : String,
            required : true
        },
        attributes: {
            type: AttributesSchema,
            required: true,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    },
);

BaseMobSchema.statics.populateDb = async (force: boolean = false, limit?: number): Promise<void> => {
    const hasItem = await BaseMobModel.countDocuments();

    if (hasItem > 0 && force === false) {
        return;
    }

    await BaseMobModel.deleteMany();

    let skinNpcFiles = fs.readdirSync('images/npcs/npc');

    if (limit) {
        skinNpcFiles = skinNpcFiles.slice(0, limit);
    }

    const mobs : Array<BaseMob> = [];

    skinNpcFiles.map(async (f, index) => {
        const multiplier = 400 / skinNpcFiles.length;
        const level = Math.round(multiplier * (index + 1));

        const mob = await BaseMobModel.createFromFile(f, "NORMAL", level);

        mobs.push(mob);
    })

    let skinBossFiles = fs.readdirSync('images/npcs/npc-boss');

    if (limit) {
        skinBossFiles = skinBossFiles.slice(0, limit);
    }

    skinBossFiles.map(async (f, index) => {
        const multiplier = 400 / skinBossFiles.length;
        const level = Math.round(multiplier * (index + 1));

        const mob = await BaseMobModel.createFromFile(f, "BOSS", level);

        mobs.push(mob);
    })

    await BaseMobModel.bulkSave(mobs);

    console.log("Création réussi de " + mobs.length + " mobs");
};

BaseMobSchema.statics.createFromFile = async (fileName : string, type : "NORMAL"|"BOSS", level : number) : Promise<BaseMob> => {

    const label = fileName
            .replace(/npc_/g, ' ')
            .replace(/_/g, ' ')
            .replace(/.png/, ' ')
            .replace(/([a-zA-Z])(\d+)/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .trim();

    let filePath = path.join('images/npcs/npc', fileName);

    if(type === "BOSS") {
        filePath = path.join('images/npcs/npc-boss', fileName);
    }

    const doc = new BaseMobModel({
        name: label,
        type: type,
        level: level,
        skin : filePath,
    });

    doc.attributes.distributePoints(level * 3);

    return doc;
}

/**
 * Retourne un mob aléatoire à -5, +5 niveaux autour du joueur
 * @param level
 * @returns
 */
BaseMobSchema.statics.findByLevelAround = async (level: number): Promise<BaseMob> => {
    const agg = await BaseMobModel.aggregate([
        { $match: { level: { $gte: level - 10, $lte: level + 10 } } },
        { $sample: { size: 1 } },
    ]).limit(1);

    return new BaseMobModel(agg[0]);
};

const BaseMobModel = model<IBaseMob, IBaseMobModel>('BaseMob', BaseMobSchema);

export { BaseMobModel };
