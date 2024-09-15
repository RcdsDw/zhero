import { ColorResolvable } from 'discord.js';

export default class Rarity {
    static readonly RARITIES = [
        new Rarity('POOR', 'Médiocre', 'Default', 1, 50),
        new Rarity('COMMON', 'Commun', 'Green', 1.2, 30),
        new Rarity('UNCOMMON', 'Peu commun', 'DarkGreen', 1.4, 10),
        new Rarity('RARE', 'Rare', 'Blue', 1.7, 5),
        new Rarity('EPIC', 'Epique', 'Purple', 2, 3),
        new Rarity('LEGENDARY', 'Légendaire', 'Gold', 2.3, 1.5),
        new Rarity('ULTIMATE', 'Ultime', 'White', 2.6, 0.05),
        new Rarity('DIVINE', 'Divine', 'NotQuiteBlack', 3, 0.05),
    ];

    private constructor(
        public readonly key: string,
        public readonly name: string,
        public readonly color: ColorResolvable,
        public readonly multiplier: number,
        public readonly dropRate: number,
    ) {}

    public static getRandom(): Rarity {
        const weights = Array<Rarity>().concat(
            ...this.RARITIES.map((r: Rarity) => Array<Rarity>(Math.ceil(r.dropRate)).fill(r)),
        );

        return weights[Math.floor(Math.random() * weights.length)];
    }

    public static getByKey(key: string): Rarity {
        const r = this.RARITIES.find((r) => r.key === key);

        if (r === undefined) {
            throw new Error(`La clé ${key} n'existe pas dans Rarity`);
        }

        return r;
    }
}
