import { AttributesModule, IAttributes } from '../../models/user/attributes';

export class Fighter {
    type: string;
    currentHealth: number;
    attributes: IAttributes | AttributesModule;

    constructor(type: 'MOB' | 'USER', attributes: IAttributes | AttributesModule) {
        this.type = type;
        this.currentHealth = attributes.health * 100;
        this.attributes = attributes;
    }
}
