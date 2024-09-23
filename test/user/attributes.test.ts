import { expect } from 'chai';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import Rarity from '../../src/enum/rarity';
import { AttributesModule } from '../../src/models/user/attributes';

dotenv.config();

describe('Attribute', () => {
    let user: User;

    let user2: User;

    beforeEach(function () {
        user = new UserModel();
        user2 = new UserModel();
    });

    it('should get total and distribute points', async () => {
        user.attributes.distributePoints(50);

        const total = user.attributes.getTotalPoints();

        expect(total).to.be.equal(50);
    });

    it('should apply rarity', async () => {
        const totalBefore = 50;

        user.attributes.distributePoints(totalBefore);

        const rarity = Rarity.RARITIES[4];
        
        user.attributes.applyRarity(rarity);

        const totalAfter = user.attributes.getTotalPoints();

        expect(totalAfter).to.be.equal(totalBefore * rarity.multiplier);
    });

    it('should add attributes', async () => {
        user.attributes.strength = 10;
        user2.attributes.strength = 5;

        user.attributes.health = 20;
        user2.attributes.health = 30;

        const resAttributes = user.attributes.add(user2.attributes);

        expect(resAttributes.strength).to.be.equal(user.attributes.strength + user2.attributes.strength);
        expect(resAttributes.health).to.be.equal(user.attributes.health + user2.attributes.health);
    });
});