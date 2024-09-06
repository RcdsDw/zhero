import { CanvasRenderingContext2D, loadImage } from "canvas";
import { Gender, SkinModule } from "../../models/user/skin";
import * as fs from 'fs';
import * as path from 'path';

export default class Part {

    protected attribute : string;

    constructor(attribute : string) {
        this.attribute = attribute;
    }

    protected getFolderPath(gender : Gender) {
        return path.join("images/character", gender, this.attribute + "_type");
    }

    public getAttribute() : string {
        return this.attribute;
    }

    /**
     * Retourne un nombre aléatoire
     */
    public getRandom(gender : Gender) : number {
        const path = this.getFolderPath(gender);

        if(!fs.existsSync(path)) {
            return 0;
        }

        const { length } = fs.readdirSync(this.getFolderPath(gender));

        return Math.floor(Math.random() * (length - 1) + 1);
    }

    /**
     * Retourne l'image
     */
    protected getImagePath(skin : SkinModule) : string|null {

        if(!(this.attribute in skin)) {
            throw new Error(`L'attribut ${this.attribute} n'existe pas dans SkinModule`);
        }

        const image_path = path.join(this.getFolderPath(skin.gender), `${skin[this.attribute]}.png`);

        if(fs.existsSync(image_path)) {
            return image_path;
        }

        return null;
    }

    /**
     * Dessine l'image sur le canvas
     * @param skin
     * @param ctx 
     */
    public async drawImage(skin: SkinModule, ctx: CanvasRenderingContext2D): Promise<void> {
        const path = this.getImagePath(skin);

        if(path === null) {
            return;
        }

        const image = await loadImage(path);

        if(this.attribute === 'color') {
            ctx.drawImage(image, 10, 180);
        } else if(skin.gender === Gender.Men) {
            ctx.drawImage(image, 65, 10);
        } else if(skin.gender === Gender.Women) {
            ctx.drawImage(image, 57, 20);
        }
    }
}