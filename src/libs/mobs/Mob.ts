import { IAttributes } from '../../models/user/attributes';

export default class Mob {
    name: string;
    lvl: number;
    skin: string;
    attributes: IAttributes;

    constructor(name: string, lvl: number, skin: string, attributes: IAttributes) {
        this.name = name;
        this.lvl = lvl;
        this.skin = skin;
        this.attributes = attributes;
    }
}
