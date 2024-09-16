import fs from 'fs';
import path from 'path'
import pathNpc from '../../../images/npcs/npc'

fs.readdir(pathNpc, (files: File[]) => {
    const mobs: any[] = []
    files.forEach(file => {
        const fileName = path.parse(file).base;
        const args = fileName.split('.')
        const mob: any = {
            avatar: file,
            name: args[0],
            lvl: Math.floor(Math.random() * 400),
        }

        mobs.push(mob)
    })

    fs.writeFile('test.json', mobs, (err: Error) => {
        if (err) {
            console.log('Error :', err)
        }
    })
})