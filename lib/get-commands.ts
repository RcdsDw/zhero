import { Collection } from 'discord.js';
import { Command } from './interfaces/command';

import * as fs from 'node:fs';
import * as path from 'node:path';

export const getCommands = (): Collection<string, Command> => {
  const commands = new Collection<string, Command>();

  const foldersPath = path.join(__dirname, './commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
  return commands;
};