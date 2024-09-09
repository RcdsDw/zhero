import { createCanvas } from 'canvas';
import { Gender, ISkin, SkinModel, SkinModule } from '../../models/user/skin';
import { randomEnumValue } from '../utils';
import Part from './Part';
import PartWithColor from './PartWithColor';
import * as path from 'path';
import * as fs from 'fs';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import PartHairBack from './PartHairBack';

export default class PartManager {
    private static parts: Part[] = [
        new PartHairBack(),
        new Part('color', 'Couleur'),
        new PartWithColor('head', 'Visage'),
        new PartWithColor('nose', 'Nez'),
        new PartWithColor('mouth', 'Bouche'),
        new Part('eyes', 'Yeux'),
        new Part('eyebrows', 'Sourcils'),
        new Part('hair', 'Cheveux'),
        new Part('facial_hair', 'Barbe', false),
        new Part('decoration', 'Extra', false),
    ];

    /**
     * Génère un skin aléatoire avec des valeurs possibles
     * @returns Skin
     */
    public static getRandomSkin(): SkinModule {
        const randomGender = randomEnumValue(Gender);

        let attributes: { [k: string]: any } = {
            gender: randomGender,
        };

        this.parts.forEach((part) => {
            attributes[part.getAttribute()] = part.getRandom(randomGender);
        });

        attributes['hair_back'] = attributes['hair'];

        const skin = new SkinModel(attributes);

        return skin;
    }

    /**
     * Retourne l'image du skin
     */
    public static async getImage(skin: any): Promise<string> {
        const imagePath = this.getSkinImagePath(skin);

        if (fs.existsSync(imagePath)) {
            return imagePath;
        }

        await this.generateImage(skin);

        return imagePath;
    }

    /**
     * Retourne les sélecteurs pour chaque attribut
     */
    public static getRows(skin: SkinModule): ActionRowBuilder<ButtonBuilder>[] {
        let rows: ActionRowBuilder<ButtonBuilder>[] = [];

        // On enlève la barbe pour les femmes
        const filteredParts = this.parts
            .map((p) => {
                if (
                    (skin.gender === Gender.Women && p.getAttribute() === 'facial_hair') ||
                    p.getAttribute().toString() === 'hair_back'
                ) {
                    return null;
                }

                return p;
            })
            .filter((p) => p !== null);

        for (let i = 0; i < filteredParts.length; i += 2) {
            const chunk = filteredParts.slice(i, i + 2);
            const row = new ActionRowBuilder<ButtonBuilder>();

            chunk.forEach((c) => row.addComponents(c.getButtons()));

            rows.push(row);
        }

        rows
            .at(0)
            ?.setComponents(
                new ButtonBuilder()
                    .setLabel('Aléatoire')
                    .setCustomId('SkinButton-random')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎲'),
                ...(rows.at(0)?.components ?? []),
            );

        if (skin.gender === Gender.Women) {
            rows.push(new ActionRowBuilder<ButtonBuilder>());
        }

        rows.at(rows.length - 1)?.addComponents(
            new ButtonBuilder()
                .setLabel(skin.gender === Gender.Men ? 'Femme' : 'Homme')
                .setCustomId('SkinButton-gender')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(skin.gender === Gender.Men ? '🚺' : '🚹'),
            new ButtonBuilder().setLabel('Confirmer').setCustomId('SkinButton-confirm').setStyle(ButtonStyle.Success),
        );

        return rows;
    }

    /**
     * Retourne une partie
     */
    public static getPart(attribute: keyof ISkin): Part | undefined {
        return this.parts.find((p) => p.getAttribute() === attribute);
    }

    /**
     * Génère une image en fonction d'un skin
     */
    private static async generateImage(skin: SkinModule): Promise<void> {
        const canvas = createCanvas(350, 900);
        const ctx = canvas.getContext('2d');

        for await (const part of this.parts) {
            await part.drawImage(skin, ctx);
        }

        // Génération de l'image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(this.getSkinImagePath(skin), buffer);
    }

    /**
     * Retourne le chemin de l'image en fonction du skin
     */
    private static getSkinImagePath(skin: SkinModule) {
        const skinValues = Object.values(skin.toObject()).slice(0, -1);
        return path.join('public/skin', skinValues.join('_') + '.png');
    }
}
