import { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';
import bot from './bot';

dotenv.config();

bot.login(process.env.TOKEN_BOT);

async function run() {
    const db = await connect(process.env.DB_URL ?? '');

    console.log('Connexion réussi à la base de données');
}

run();
