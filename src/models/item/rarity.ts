export default class Rarity {
    static readonly POOR = new Rarity('POOR', 'Médiocre', 'Default', 1, 50);
    static readonly COMMON = new Rarity('COMMON', 'Commun', 'Green', 1.2, 30);
    static readonly UNCOMMON = new Rarity('UNCOMMON', 'Peu commun', 'DarkGreen', 1.4, 10);
    static readonly RARE = new Rarity('RARE', 'Rare', 'Blue', 1.7, 5);
    static readonly EPIC = new Rarity('EPIC', 'Epique', 'Purple', 2, 3);
    static readonly LEGENDARY = new Rarity('LEGENDARY', 'Légendaire', 'Gold', 2.3, 1.5);
    static readonly ULTIMATE = new Rarity('ULTIMATE', 'Ultime', 'White', 2.6, 0.05);
    static readonly DIVINE = new Rarity('DIVINE', 'Divine', 'Black', 3, 0.05);

    private constructor(
        public readonly key : string,
        public readonly name : string,  
        public readonly color : string, 
        public readonly multiplier : number,
        public readonly dropRate : number,
    )
    {

    }

    public static getRandom() : Rarity {
        const rarities = [this.POOR, this.COMMON, this.UNCOMMON, this.EPIC, this.RARE, this.LEGENDARY, this.ULTIMATE];
        const weights = Array<Rarity>().concat(...rarities.map((r : Rarity) => Array<Rarity>(Math.ceil(r.dropRate)).fill(r)));
        
        return weights[Math.floor(Math.random() * weights.length)];
    }
}