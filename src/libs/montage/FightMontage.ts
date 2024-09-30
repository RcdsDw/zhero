import * as fs from 'fs';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { Fighter } from "../fight/Fighter";

export default class FightMontage {
    public static async getImage(player1 : Fighter, player2 : Fighter): Promise<string> {
        const imagePath = this.getFightImagePath(player1, player2);

        await this.generateImage(player1, player2);

        return imagePath;
    }

    /**
     * Génère une image en fonction d'un skin
     */
    public static async generateImage(player1 : Fighter, player2 : Fighter): Promise<void> {
        const canvas = createCanvas(1200, 1000);
        const ctx = canvas.getContext('2d');

        // Draw des sprites
        const player1Image = await loadImage(player1.image);
        const player2Image = await loadImage(player2.image);

        ctx.drawImage(player1Image, 150, 0);
        ctx.drawImage(player2Image, 600, -100, 620, 1100);

        // Draw de la barre de vie
        const widthFullHealth = 500;

        ctx.fillStyle = '#8B0000';
        ctx.fillRect(100, 920, widthFullHealth, 80);
        ctx.fillRect(680, 920, widthFullHealth, 80);

        const widthHealthPlayer1 = player1.currentHealth / player1.maxHealth * widthFullHealth;
        const widthHealthPlayer2 = player2.currentHealth / player2.maxHealth * widthFullHealth;

        ctx.fillStyle = 'red';
        ctx.fillRect(100, 920, widthHealthPlayer1, 80);
        ctx.fillRect(680, 920, widthHealthPlayer2, 80);

        // Draw du texte de la barre de vie
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; 

        const textPlayer1 = `${player1.currentHealth} / ${player1.maxHealth}`;
        const textPlayer2 = `${player2.currentHealth} / ${player2.maxHealth}`;
        
        ctx.fillText(textPlayer1, 350, 960);
        ctx.fillText(textPlayer2, 930, 960);

        // Génération de l'image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(this.getFightImagePath(player1, player2), buffer);
    }

    /**
     * Retourne le chemin de l'image en fonction du skin
     */
    private static getFightImagePath(player1 : Fighter, player2 : Fighter) {
        return path.join('public/fight', `${player1.name}_${player2.name}.png`);
    }
}
