import { expect } from 'chai';
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import { BaseMobModel } from '../../src/models/mob/baseMob';

dotenv.config();

describe('Shop', () => {
    let user: User;

    before(async () => {
        await connect(process.env.DB_URL ?? '', {
            dbName: 'zhero_test',
        });

        user = await UserModel.create({
            id: 'mob',
        });
    });

    after(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should populate db', async () => {
        await BaseMobModel.populateDb(true, 50);
    });

    it('should get mob around level of user', async () => {
        user.experience.level = 5;
        const mob = await BaseMobModel.findByLevelAround(user.experience.level);

        expect(mob).to.be.an.instanceOf(BaseMobModel);

        expect(mob.level).to.be.lessThanOrEqual(user.experience.level + 5);
        expect(mob.level).to.be.greaterThanOrEqual(user.experience.level - 5);
    });
});
