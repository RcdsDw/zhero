import { createCanvas, loadImage } from "canvas";
import { Gender, ISkin, SkinModel, SkinModule } from "../../models/user/skin";
import { randomEnumValue } from "../utils";
import Part from "./Part";
import PartWithColor from "./PartWithColor";
import * as path from 'path';
import * as fs from 'fs';

export default class PartManager {
    private static parts : Part[] =  [
        new Part("color"),
        new PartWithColor("head"),
        new PartWithColor("nose"),
        new PartWithColor("mouth"),
        new Part("eyes"),
        new Part("eyebrows"),
        new Part("hair"),
        new Part("facial_hair"),
        new Part("decoration")
    ];

    /**
     * Génère un skin aléatoire avec des valeurs possibles
     * @returns Skin
     */
    public static getRandomSkin() : SkinModule {

        const randomGender = randomEnumValue(Gender);

        let attributes : {[k: string]: any} = {
            gender : randomGender
        };

        this.parts.forEach(part => {
            attributes[part.getAttribute()] = part.getRandom(randomGender);
        })

        const skin = new SkinModel(attributes);

        return skin;
    }

    /**
     * Retourne l'image du skin
     */
    public static async getImage(skin : SkinModule) : Promise<string> {
        const imagePath = this.getSkinImagePath(skin);

        if(fs.existsSync(imagePath)) {
            return imagePath;
        }

        await this.generateImage(skin);

        return imagePath;
    }

    /**
     * Génère une image en fonction d'un skin
     */
    private static async generateImage(skin : SkinModule) : Promise<void> {

        const canvas = createCanvas(350, 900);
        const ctx = canvas.getContext('2d');

        for await (const part of this.parts) {
            await part.drawImage(skin , ctx);
        }

        // Génération de l'image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(this.getSkinImagePath(skin), buffer);
    }

    /**
     * Retourne le chemin de l'image en fonction du skin
     */
    private static getSkinImagePath(skin : SkinModule) {
        const skinValues = Object.values(skin.toObject()).slice(0, -1);
        return path.join("public/skin", skinValues.join('_') + ".png");
    }
}