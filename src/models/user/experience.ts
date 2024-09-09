import { HydratedDocument, Schema } from 'mongoose';

// Données du document
interface IExperience {
    total: number;
    level: number;
    progression: number;
}

// Méthodes sur l'instance
interface IExperienceMethods {
    add(amount: number): void;
}

export type ExperienceModule = HydratedDocument<IExperience, IExperienceMethods>;

export const ExperienceSchema: Schema = new Schema<IExperience, {}, IExperienceMethods>({
    total: {
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: Number,
        required: true,
        default: 1,
    },
    progression: {
        type: Number,
        required: true,
        default: 1,
    },
});

/**
 * Ajoute de l'expérience au joueur et recalcule l'avancement et le niveau
 * @param amount
 */
ExperienceSchema.methods.add = function (amount: number) {
    this.total = this.total + amount;

    this.level = Math.floor(Math.sqrt(this.total / 100));

    let xpNiveauActuel = 100 * this.level * this.level;
    let xpNiveauSuivant = 100 * (this.level + 1) * (this.level + 1);

    this.progression = ((this.total - xpNiveauActuel) / (xpNiveauSuivant - xpNiveauActuel)) * 100;
};
