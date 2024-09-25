import { AttributesModule, IAttributes } from '../../models/user/attributes';

export class Fighter {
    type: string;
    name: string;
    currentHealth: number;
    attributes: IAttributes | AttributesModule;

    constructor(type: 'MOB' | 'USER', name: string, attributes: IAttributes | AttributesModule) {
        this.type = type;
        this.name = name
        this.attributes = attributes;
        this.currentHealth = this.attributes.health * 100;
    }
}
