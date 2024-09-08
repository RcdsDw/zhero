import { createCanvas, loadImage } from "canvas";
import { Gender, ISkin, SkinModel, SkinModule } from "../../models/user/skin";
import { randomEnumValue } from "../utils";
import Part from "./Part";
import PartWithColor from "./PartWithColor";
import * as path from 'path';
import * as fs from 'fs';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";

export default class PartManager {
    private static parts : Part[] =  [
        new Part("color", "Couleur"),
        new PartWithColor("head", "Visage"),
        new PartWithColor("nose", "Nez"),
        new PartWithColor("mouth", "Bouche"),
        new Part("eyes", "Yeux"),
        new Part("eyebrows", "Sourcils"),
        new Part("hair", "Cheveux"),
        new Part("facial_hair", "Barbe"),
        new Part("decoration", "Extra")
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
     * Retourne les sélecteurs pour chaque attribut
     */
    public static getRows(skin : SkinModule) : ActionRowBuilder<ButtonBuilder>[] {

        let rows : ActionRowBuilder<ButtonBuilder>[] = [];

        for (let i = 0; i < this.parts.length; i += 2) {
            const chunk = this.parts.slice(i, i + 2);
            const row = new ActionRowBuilder<ButtonBuilder>();

            chunk.forEach(c => row.addComponents(c.getButtons()));

            rows.push(row);
        }

        rows.at(0)?.setComponents(
            new ButtonBuilder()
                .setLabel("Aléatoire")
                .setCustomId('SkinButton-random')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🎲'),
            ...rows.at(0)?.components ?? []
        )

        rows.at(4)?.addComponents(
            new ButtonBuilder()
                .setLabel(skin.gender === Gender.Men ? 'Femme' : 'Homme')
                .setCustomId('SkinButton-gender')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(skin.gender === Gender.Men ? '🚺' : '🚹'),
            new ButtonBuilder()
                .setLabel("Annuler")
                .setCustomId('SkinButton-cancel')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setLabel("Confirmer")
                .setCustomId('SkinButton-confirm')
                .setStyle(ButtonStyle.Success)
        )

        return rows;
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