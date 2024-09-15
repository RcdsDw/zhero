import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { getCommands } from './libs/discord/getCommands';
import { Command } from './interfaces/command';

dotenv.config();

// and deploy your commands!
(async () => {
    const commands = (await getCommands()).map((command: Command) => command.data.toJSON());

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.TOKEN_BOT ?? '');

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data_commands: any = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ''), {
            body: Array.from(commands),
        });

        console.log(`Successfully reloaded ${data_commands.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
