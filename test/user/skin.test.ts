import { expect } from 'chai';
import dotenv from 'dotenv';
import { User, UserModel } from '../../src/models/user/user';
import * as fs from 'fs';
import { Gender } from '../../src/models/user/skin';
import PartManager from '../../src/libs/montage/PartManager';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

dotenv.config();

describe('Skin', () => {
    let user: User;

    before(async () => {
        user = new UserModel({
            id: 'skin',
        });
    });

    it('should get image of skin', async () => {
        const image_path = await user.skin.getImage();

        expect(fs.existsSync(image_path)).to.be.equal(true);
    });

    it('should increase part', async () => {
        const hairExpected = user.skin.hair + 1;

        user.skin.increaseAttribute('hair');

        expect(user.skin.hair).to.be.equal(hairExpected);
    });

    it('should decrease part', async () => {
        const hairExpected = user.skin.hair - 1;

        user.skin.decreaseAttribute('hair');

        expect(user.skin.hair).to.be.equal(hairExpected);
    });

    it('should increase part with color', async () => {
        const mouthExpected = user.skin.mouth + 1;

        user.skin.increaseAttribute('mouth');

        expect(user.skin.mouth).to.be.equal(mouthExpected);
    });

    it('should decrease part with color', async () => {
        const mouthExpected = user.skin.mouth - 1;

        user.skin.decreaseAttribute('mouth');

        expect(user.skin.mouth).to.be.equal(mouthExpected);
    });

    it('should switch gender', async () => {
        const genderExpected = user.skin.gender === Gender.Men ? Gender.Women : Gender.Men;

        user.skin.switchGender();

        expect(user.skin.gender).to.be.equal(genderExpected);
    });

    it('should discord rows', async () => {
        const rows = PartManager.getRows(user.skin);

        expect(rows).to.be.instanceOf(Array<ActionRowBuilder<ButtonBuilder>>);
    });
});
