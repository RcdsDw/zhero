import { User } from '../../models/user/user';
import * as fs from 'fs';
import * as path from 'path';
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { Gender } from '../../models/user/skin';
import { ItemModel } from '../../models/item/item';

export default class StuffMontage {
    public static async getImage(user: User): Promise<string> {
        const imagePath = this.getStuffImagePath(user);

        if (fs.existsSync(imagePath)) {
            return imagePath;
        }

        await this.generateImage(user);

        return imagePath;
    }

    /**
     * Génère une image en fonction d'un skin
     */
    public static async generateImage(user: User): Promise<void> {
        const canvas = createCanvas(350, 900);
        const ctx = canvas.getContext('2d');

        // On dessine la cape avant car elle doit être derrière le personnage
        this.drawItem(ctx, user.stuff.cape, user);

        const skinPath = await user.skin.getImage();
        const skinImage = await loadImage(skinPath);

        ctx.drawImage(skinImage, 0, 0);

        const items = user.stuff.getAllItems().filter(item => item && item.type !== 'cape');

        await Promise.all(
            items.map(async (item) => {
                this.drawItem(ctx, item, user);
            }),
        );

        // Génération de l'image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(this.getStuffImagePath(user), buffer);
    }

    /**
     * Retourne le chemin de l'image en fonction du skin
     */
    private static getStuffImagePath(user: User) {
        return path.join('public/stuff', user.id + '.png');
    }
    
    /**
     * Dessine un item sur un canvas
     */
    private static async drawItem(ctx: CanvasRenderingContext2D, item : ItemModel, user : User) : Promise<void> {
        if (item === null || item.asset_men === undefined) {
            return;
        }

        const itemPath = user.skin.gender === Gender.Men ? item.asset_men : item.asset_women;
        const itemImage = await loadImage(itemPath);

        if (user.skin.gender === Gender.Men) {
            ctx.drawImage(itemImage, -201, -35, 683, 1010);
        } else {
            ctx.drawImage(itemImage, -205, -12, 687, 1010);
        }
    }
}
