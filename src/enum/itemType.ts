export default class ItemType {
    static readonly ITEMTYPES = [
        new ItemType('gadget', 'Gadget', '', 317),
        new ItemType('weapon', 'Arme', '', 180),
        new ItemType('mask', 'Masque', '', 335),
        new ItemType('suit', 'Tenu', '', 494),
        new ItemType('boots', 'Chaussures', '', 286),
        new ItemType('sidekick', 'Compagnon', '', 172),
        new ItemType('cape', 'Cape', '', 319),
        new ItemType('belt', 'Ceinture', '', 327),
    ];

    private constructor(
        public readonly key: string,
        public readonly name: string,
        public readonly emoji: string,
        public readonly total: number,
    ) {}

    public static getByKey(key: string): ItemType {
        const a = this.ITEMTYPES.find((a) => a.key === key);

        if (a === undefined) {
            throw new Error(`La clé ${key} n'existe pas dans ItemType`);
        }

        return a;
    }
}
