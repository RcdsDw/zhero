import { Collection, Events } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { Event } from '../../interfaces/event';

/**
 * Retourne une collection contenant les events du dossier events. Le nom de l'événement en clé et les données de l'événement en valeur
 */
export const getEvents = (): Event[] => {
    const events = [];

    const eventsPath = path.join(__dirname, '../../events');

    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default;

        // Set a new item in the Collection with the key as the event name and the value as the exported module
        if ('name' in event && 'execute' in event) {
            events.push(event);
        } else {
            console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
        }
    }

    return events;
};
