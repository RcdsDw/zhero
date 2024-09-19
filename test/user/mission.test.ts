import { expect } from 'chai';
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import { ButtonInteraction } from 'discord.js';

dotenv.config();

describe('Mission', () => {
    let user: User;

    before(async () => {
        await connect(process.env.DB_URL ?? '', {
            dbName: 'zhero_test',
        });

        user = await UserModel.create({
            id: '123',
        });
    });

    after(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should get all mission', async () => {
        const missions = await user.mission.getMissions(user);

        expect(missions).to.be.an('array');
        expect(missions).to.be.an('array');
        expect(user.mission.current).to.be.undefined;
    });

    it('should choose a mission', async () => {
        await user.mission.confirmMission(0, user, {} as ButtonInteraction);

        expect(user.mission.current).to.not.be.null;
    });

    it('should get current mission', async () => {
        const currentMission = await user.mission.getMissions(user);

        expect(currentMission).to.not.be.an('array');
    });

    it('should stop a mission', async () => {
        user.mission.stopCurrentMission();

        expect(user.mission.current).to.be.null;
    });

    it('should choose a mission and get reward', async () => {
        await user.mission.confirmMission(0, user, {} as ButtonInteraction);

        const currentMission = user.mission.current;

        const goldBefore = user.gold;
        const xpBefore = user.experience.total;

        await user.mission.sendRewards(user, currentMission.rewardXp, currentMission.rewardGold);

        expect(user.mission.current).to.be.null;
        expect(user.gold).to.be.equal(goldBefore + currentMission.rewardGold);
        expect(user.experience.total).to.be.equal(xpBefore + currentMission.rewardXp);
    });
});
