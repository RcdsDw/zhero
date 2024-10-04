import { connect } from 'mongoose';
import dotenv from 'dotenv';
import bot from './bot';
import { BaseItemModel } from './models/item/baseItem';
import { BaseMobModel } from './models/mob/baseMob';

dotenv.config();

bot.login(process.env.TOKEN_BOT);

async function run() {
    await connect(process.env.DB_URL ?? '', {
        dbName: 'zhero',
    });

    console.log('Connexion réussi à la base de données');

    BaseItemModel.populateDb(false);

    BaseMobModel.populateDb(true);
}

run();
