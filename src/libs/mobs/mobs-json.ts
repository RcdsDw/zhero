import fs from 'fs';
import path from 'path';
import { BaseMob, BaseMobModel } from '../../models/mob/baseMob';

const outputDir = path.join(__dirname, '../../datas');
const outputPath = path.join(outputDir, 'mobs.json');

const generateMobsJSON = async () => {
    try {
        const mobs = await BaseMobModel.find();
        const mobsToJSON: Object[] = [];
        let count: number = 1;

        mobs.forEach((mob: BaseMob) => {
            const mobJSON: Object = {
                name: mob.name,
                lvl: mob.level,
                skin: mob.skin,
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
                console.log("C'est écrit mon gars");
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des mobs :', error);
    }
};

generateMobsJSON();