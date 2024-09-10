import Part from './Part';
import { ISkin, SkinModule } from '../../models/user/skin';
import * as fs from 'fs';
import * as path from 'path';

export default class PartHairBack extends Part {
    constructor() {
        super('hair_back' as keyof ISkin, 'hair_back');
    }

    /**
     * Retourne l'image
     */
    protected getImagePath(skin: SkinModule): string | null {
        const image_path = path.join(this.getFolderPath(skin.gender), `${skin['hair']}.png`);

        if (fs.existsSync(image_path)) {
            return image_path;
        }

        return null;
    }
}
