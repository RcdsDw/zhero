import { expect } from 'chai';
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import { BaseItemModel } from '../../src/models/item/baseItem';

dotenv.config();

describe('Shop', () => {
    let user: User;

    before(async () => {
        await connect(process.env.DB_URL ?? '', {
            dbName: 'zhero_test',
        });

        user = await UserModel.create({
            id: 'shop',
        });

        await BaseItemModel.populateDb(false, 30);
    });

    after(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should get item around level of user', async () => {
        const baseItems = await BaseItemModel.findByLevelAround(user.experience.level);

        expect(baseItems.length).to.be.equal(5);

        baseItems.forEach((baseItem) => {
            expect(baseItem).to.be.an.instanceOf(BaseItemModel);

            expect(baseItem.level).to.be.lessThanOrEqual(user.experience.level + 10);
            expect(baseItem.level).to.be.greaterThanOrEqual(user.experience.level - 10);
        });
    });

    it('should get items of shop', async () => {
        const shopItems = await user.shop.getItems(user);

        expect(shopItems.length).to.be.equal(5);

        shopItems.forEach((item) => {
            expect(item.level).to.be.lessThanOrEqual(user.experience.level + 10);
            expect(item.level).to.be.greaterThanOrEqual(user.experience.level - 10);
        });
    });

    it('should buy items', async () => {
        const shopItems = await user.shop.getItems(user);
        const item = shopItems[0];

        user.gold = 50;

        await user.buyItem(0);

        expect(user.gold).to.be.equal(50 - item.price);
        expect(user.inventory.items[0].name).to.be.equal(item.name);
    });

    it('should sell item', async () => {
        const inventoryItem = user.inventory.items[0];

        const goldExpected = user.gold + inventoryItem.getSellPrice();

        await user.sellItem(0);

        expect(user.gold).to.be.equal(goldExpected);
        expect(user.inventory.items[0]).to.be.undefined;
    });
});
