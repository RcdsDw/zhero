import { expect } from 'chai';
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { User, UserModel } from '../../src/models/user/user';
import { BaseItemModel } from '../../src/models/item/baseItem';
import { StuffModule } from '../../src/models/user/stuff';
import { ItemModel } from '../../src/models/item/item';

dotenv.config();

describe('Stuff', () => {
    let user: User;

    let equipedItem: ItemModel;

    before(async () => {
        await connect(process.env.DB_URL ?? '', {
            dbName: 'zhero_test',
        });

        user = await UserModel.create({
            id: 'stuff',
            gold : 50
        });

        user.experience.level = 5;

        await BaseItemModel.populateDb(false, 30);
    });

    after(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should equip item with a lower or equal level', async () => {
        const items = await user.shop.getItems(user);

        const itemIndex = items.findIndex(i => i.level <= user.experience.level);

        if(itemIndex === -1) {
            return;
        }

        await user.buyItem(itemIndex);

        equipedItem = user.inventory.items[0];

        await user.equipItem(0);

        expect(user.stuff[equipedItem.type as keyof StuffModule]).to.not.be.null;
    });

    it('should get item by type', async () => {
        const item = user.stuff.getItemByType(equipedItem.type);

        expect(item?.name).to.be.equal(equipedItem.name);
    });

    it('should get total attributes', async () => {
        const attributes = user.stuff.getTotalAttributes();

        expect(attributes.strength).to.be.equal(equipedItem.attributes.strength);
        expect(attributes.health).to.be.equal(equipedItem.attributes.health);
    });

    it('shouldn\'t equip item with a higher level', async () => {
        const items = await user.shop.getItems(user);

        const itemIndex = items.findIndex(i => i.level > user.experience.level && i.type !== equipedItem.type);

        if(itemIndex === -1) {
            return;
        }

        await user.buyItem(itemIndex)

        const item = user.inventory.items[0];

        user.equipItem(0)

        expect(user.stuff.getItemByType(item.type)).to.be.null;
    });

    it('should get stuff image', async () => {
        const imagePath = await user.getImage();

        expect(fs.existsSync(imagePath)).to.be.equal(true);
    });
});
