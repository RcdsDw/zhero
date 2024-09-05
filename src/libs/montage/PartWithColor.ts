import { Gender, SkinModule } from "../../models/user/skin";
import * as fs from 'fs';
import * as path from 'path';
import Part from "./Part";

export default class PartWithColor extends Part {

    /**
     * Retourne un nombre aléatoire
     */
    public getRandom(gender : Gender) : number {
        const {length} = fs.readdirSync(path.join(this.getFolderPath(gender), "1"));

        return Math.floor(Math.random() * (length - 1) + 1);
    }

    /**
     * Retourne l'image
     */
    protected getImagePath(skin : SkinModule) : string|null {

        if(!(this.attribute in skin)) {
            throw new Error(`L'attribut ${this.attribute} n'existe pas dans SkinModule`);
        }

        const image_path = path.join(this.getFolderPath(skin.gender), `${skin.color}`, `${skin[this.attribute]}.png`);

        if(fs.existsSync(image_path)) {
            return image_path;
        }

        return null;
    }
}