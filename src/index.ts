import { Schema, model, connect } from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

async function run() {
    const db = await connect(process.env.DB_URL ?? '');

    console.log('Connexion réussi à la base de données');
}

run();