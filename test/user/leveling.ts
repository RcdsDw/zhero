import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../../src/models/user/user';
import { ButtonInteraction } from 'discord.js';

dotenv.config();

connect(process.env.DB_URL ?? '', {
    dbName: 'zhero_test',
}).then(async () => {
    const user = new UserModel({
        id: '123',
    });
    
    let totalTime = 0;
    let totalMission = 0;
    
    await user.mission.getMissions(user);
    
    do {
        await user.mission.confirmMission(0, user, {} as ButtonInteraction);
        const currentMission = user.mission.current;
    
        totalMission++;
        totalTime += currentMission.time;
        
        await user.mission.sendRewards(user, currentMission.rewardXp, currentMission.rewardGold);

        console.log('Mission N°', totalMission)
        console.log('Level : ', user.experience.level)
        console.log('Temps : ', secondsToHumanReadable(totalTime));
        console.log("Gold : ", user.gold);
    } while (user.experience.level < 400);
    
    await connection.dropDatabase();
    await connection.close();    
});

function secondsToHumanReadable(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const daysString = days > 0 ? `${days}d ` : '';
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes}m ` : '';
    const secondsString = secs > 0 ? `${secs}s` : '';

    return `${daysString}${hoursString}${minutesString}${secondsString}`.trim();
}