import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import { ButtonInteraction } from 'discord.js';

dotenv.config();

describe('Leveling', () => {
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

    it('should level up to 400', async () => {

        let totalTime = 0;
        let totalMission = 0;

        await user.mission.getMissions(user);

        do {
            await user.mission.confirmMission(0, user, {} as ButtonInteraction);
            const currentMission = user.mission.current;

            totalMission++;
            totalTime += currentMission.time;
            
            await user.mission.sendRewards(user, currentMission.rewardXp, currentMission.rewardGold);
        } while (user.experience.level < 400);
        
        console.log("Total de mission : ", totalMission);
        console.log("Total de temps : ", secondsToHumanReadable(totalTime));
    }).timeout(5000);
});

function secondsToHumanReadable(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes}m ` : '';
    const secondsString = secs > 0 ? `${secs}s` : '';

    return `${hoursString}${minutesString}${secondsString}`.trim();
}