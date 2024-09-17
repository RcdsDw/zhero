import { HydratedDocument, Schema } from 'mongoose';
import Rarity from '../../enum/rarity';
import { EmbedBuilder } from 'discord.js';
import { ItemModel } from '../item/item';

export interface IAttributes {
    strength: number;
    health: number;
    dexterity: number;
    dodge: number;
}

// Méthodes sur l'instance
interface IAttributesMethods {
    getTotalPoints(): number;
    distributePoints(totalPoints: number): void;
    applyRarity(rarity: Rarity): void;
    addToEmbed(embed: EmbedBuilder, stuffedItem?: ItemModel | null): EmbedBuilder;
    add(attr: AttributesModule): AttributesModule;
    toString(): string;
}

export type AttributesModule = HydratedDocument<IAttributes, IAttributesMethods>;

export const AttributesSchema: Schema = new Schema<IAttributes, object, IAttributesMethods>({
    strength: {
        type: Number,
        required: true,
        default: 0,
    },
    health: {
        type: Number,
        required: true,
        default: 0,
    },
    dexterity: {
        type: Number,
        required: true,
        default: 0,
    },
    dodge: {
        type: Number,
        required: true,
        default: 0,
    },
});

/**
 * Retourne le nombre de points total
 */
AttributesSchema.methods.getTotalPoints = function (): number {
    let total = 0;

    for (const key in this) {
        total += this[key];
    }

    return total;
};

/**
 * Distribue un total de points aléatoirement
 * @param totalPoints
 */
AttributesSchema.methods.distributePoints = function (totalPoints: number): void {
    let remainingPoints = totalPoints;

    const keys = Object.keys(this.toObject()).filter((s) => !s.startsWith('_'));

    while (remainingPoints > 0) {
        const randomAttr = keys[Math.floor(Math.random() * keys.length)];
        this[randomAttr] += 1;
        remainingPoints -= 1;
    }
};

/**
 * Applique le multiplier d'une rareté sur tous les attributs
 * @param rarity
 */
AttributesSchema.methods.applyRarity = function (rarity: Rarity): void {
    const keys = Object.keys(this.toObject()).filter((s) => !s.startsWith('_'));

    keys.forEach((k) => (this[k] = Math.round(this[k] * rarity.multiplier)));
};

/**
 * Additionne deux objets attributs ensemble
 * @param attr
 * @returns
 */
AttributesSchema.methods.add = function (attr: AttributesModule): AttributesModule {
    const result: AttributesModule = attr;

    const keys = Object.keys(this.toObject()).filter((s) => !s.startsWith('_'));

    keys.map((k) => {
        let key = k as keyof IAttributes;
        result[key] = (result[key] || 0) + this[k];
    });

    return result;
};
