import fs from 'fs';
import path from 'path';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { BaseMob, BaseMobModel } from '../../models/mob/baseMob';

const outputDir = path.join(__dirname, '../../datas');
const outputPath = path.join(outputDir, 'tower.json');

const generateMobsJSON = async () => {
    try {
        await connect(process.env.DB_URL ?? '', {
            dbName: 'zhero',
        });
        dotenv.config();

        const mobs = await BaseMobModel.find().sort({level: 'asc'});
        console.log(mobs)
        const mobsToJSON: Object[] = [];
        let count: number = 1;

        mobs.forEach((mob: BaseMob) => {
            const mobJSON: Object = {
                name: mob.name,
                lvl: mob.level,
                skin: mob.skin,
                type: mob.type,
                step: count
            };
            mobsToJSON.push(mobJSON);
            count++;
        });

        console.log(`${count - 1} mobs viennent d'être ajoutés au JSON`);

        fs.writeFile(outputPath, JSON.stringify(mobsToJSON, null, 4), (err: NodeJS.ErrnoException | null) => {
            if (err) {
                console.log('Erreur :', err);
            } else {
                console.log("C'est bon ça a bien été écrit mon gars");
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des mobs :', error);
    }
};

generateMobsJSON();