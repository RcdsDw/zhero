import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

export async function connect() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.error(e)
    }
};