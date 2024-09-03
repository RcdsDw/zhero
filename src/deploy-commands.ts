import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { getCommands } from "./get-commands";

dotenv.config();

const commands : string[] = getCommands().map((command : any) => command.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? '');

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data_commands : any = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID ?? ''),
			{ body: Array.from(commands) },
		);

		console.log(`Successfully reloaded ${data_commands.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();