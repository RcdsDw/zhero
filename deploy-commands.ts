import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { getCommands } from './lib/get-commands';

config();

const token = process.env.TOKEN_BOT ?? '';
const clientId = process.env.CLIENT_ID ?? '';

const commands: string[] = getCommands().map((command: any) =>
  command.data.toJSON(),
);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data_commands: any = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data_commands.length} application (/) commands.`,
    );
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();