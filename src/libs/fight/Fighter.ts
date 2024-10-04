import { AttributesModule, IAttributes } from '../../models/user/attributes';

export class Fighter {
    type: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    attributes: IAttributes | AttributesModule;
    image: string;

    constructor(type: 'MOB' | 'USER', name: string, attributes: IAttributes | AttributesModule, image: string) {
        this.type = type;
        this.name = name;
        this.attributes = attributes;
        this.maxHealth = 100 + this.attributes.health * 10;
        this.currentHealth = this.maxHealth;
        this.image = image;
    }
}
