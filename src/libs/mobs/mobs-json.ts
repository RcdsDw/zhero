import fs from 'fs';
import path from 'path';
// import translate from '@vitalets/google-translate-api';

const pathNpc = path.join(__dirname, '../../../images/npcs/npc');
const outputDir = path.join(__dirname, '../../datas');
const outputPath = path.join(outputDir, 'mobs.json');

fs.readdir(pathNpc, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    let count: number = 0;

    const mobs: Object[] = [];
    files.forEach(async(file) => {
        const stringifyFile = file.toString();
        const fileName = path.parse(stringifyFile).base;
        const args = fileName.split('.');
        const subArgs = args[0].split('_');
        // let frName = await translate(subArgs[1] + " " + subArgs[2], {to: "fr"})
        console.log("ARGS :", args)
        const level = Math.floor(Math.random() * 400);
        const mob: Object = {
            id: stringifyFile,
            name: /*frName*/subArgs[1] + " " + subArgs[2],
            lvl: level,
            skin: path.join(pathNpc, stringifyFile),
            attributes: {
                strength: level + Math.floor(Math.random() * 10),
                health: level + Math.floor(Math.random() * 10),
                dodge: level + Math.floor(Math.random() * 10),
                armor: level + Math.floor(Math.random() * 10),
                critical: level + Math.floor(Math.random() * 10),
                speed: level + Math.floor(Math.random() * 10),
            },
        };
        mobs.push(mob);
        count++
    });

    console.log(`${count} mobs viennent d'être ajoutés.`)

    fs.writeFile(outputPath, JSON.stringify(mobs, null, 4), (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log('Error :', err);
        } else {
            console.log('File written successfully');
        }
    });
});
