import { Client, GatewayIntentBits } from 'discord.js';
import { getCommands } from './libs/discord/getCommands';
import { getButtons } from './libs/discord/getButtons';
import { getEvents } from './libs/discord/getEvents';
import { Event } from './interfaces/event';


getCommands().then((commands) => bot.commands = commands);
getButtons().then((buttons) => bot.buttons = buttons);

getEvents().then((events) => {
    events.forEach((event: Event) => {
        if (event.once) {
            bot.once(event.name, (...args) => event.execute(...args));
        } else {
            bot.on(event.name, (...args) => event.execute(...args));
        }
    });
})

const bot = new Client({
    intents: [GatewayIntentBits.Guilds],
});    

export default bot;