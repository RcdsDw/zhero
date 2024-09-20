export default class Attribute {
    static readonly ATTRIBUTES = [
        new Attribute('strength', 'Force', 'Augmente vos dégats', '💪🏽'),
        new Attribute('health', 'Point de vie', 'Augmente vos points de vie', '❤️'),
        new Attribute('dexterity', 'Dextérité', 'Augmente vos chance de maximiser le coup', '🤸🏽‍♂️'),
        new Attribute('dodge', 'Esquive', "Augmente vos chance d'esquiver les coups", ''),
        new Attribute('armor', 'Armure', 'Réduit les dégats subis', '🛡️'),
        new Attribute('critical', 'Critique', 'Augmente vos chances de coups critiques', '🥊'),
        new Attribute('luck', 'Chance', 'Augmente vos chances de drop', '🎲'),
        new Attribute('speed', 'Vitesse', 'Augmente vos chances de doubles coups', '✈️'),
    ];

    private constructor(
        public readonly key: string,
        public readonly name: string,
        public readonly description: string,
        public readonly emoji: string,
    ) {}

    public static getByKey(key: string): Attribute {
        const a = this.ATTRIBUTES.find((a) => a.key === key);

        if (a === undefined) {
            throw new Error(`La clé ${key} n'existe pas dans Attribute`);
        }

        return a;
    }
}
