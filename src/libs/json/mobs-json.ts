import fs from 'fs';
import path from 'path';

const pathNpc = path.join(__dirname, '../../../images/npcs/npc')

fs.readdir(pathNpc, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const mobs: Object[] = []
    files.forEach(file => {
        const stringifyFile = file.toString()
        const fileName = path.parse(stringifyFile).base;
        const args = fileName.split('.')
        const level = Math.floor(Math.random() * 400)
        const mob: Object = {
            id: stringifyFile,
            name: args[0],
            lvl: level,
            skin: path.join(pathNpc, stringifyFile),
            attributes: {
                "strength": level + Math.floor(Math.random() * 10),
                "health": level + Math.floor(Math.random() * 10),
                "dodge": level + Math.floor(Math.random() * 10),
                "armor": level + Math.floor(Math.random() * 10),
                "critical": level + Math.floor(Math.random() * 10),
                "speed": level + Math.floor(Math.random() * 10)
            }
        }

        mobs.push(mob)
    })

    console.log("Mob 1 : ", mobs[0])

    fs.writeFile('mobs.json', JSON.stringify(mobs, null, 4), (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log('Error :', err)
        } else {
            console.log('File written successfully');
        }
    })
})