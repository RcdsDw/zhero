import { Collection } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { Button } from '../../interfaces/button';

/**
 * Retourne une collection contenant les buttons du dossier buttons. L'id du button en clé et les données de la commande en valeur
 */
export const getButtons = (): Collection<string, Button> => {
  const buttons = new Collection<string, Button>();

  const foldersPath = path.join(__dirname, '../../buttons');
  const buttonFolders = fs.readdirSync(foldersPath);

  for (const folder of buttonFolders) {
    const buttonsPath = path.join(foldersPath, folder);
    const stat = fs.lstatSync(buttonsPath);

    if (stat.isFile()) {
      continue;
    }

    const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith('.ts'));
    for (const file of buttonFiles) {
      const filePath = path.join(buttonsPath, file);
      const button = require(filePath);
      // Set a new item in the Collection with the key as the button name and the value as the exported module
      if ('id' in button && 'execute' in button) {
        buttons.set(button.id, button);
      } else {
        console.log(`[WARNING] The button at ${filePath} is missing a required "id" or "execute" property.`);
      }
    }
  }

  return buttons;
};
