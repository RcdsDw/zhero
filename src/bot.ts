import { Client, GatewayIntentBits } from 'discord.js';
import { getCommands } from './libs/discord/getCommands';
import { getButtons } from './libs/discord/getButtons';
import { getEvents } from './libs/discord/getEvents';
import { Event } from './interfaces/event';

const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
});

bot.commands = getCommands();
bot.buttons = getButtons();

const events = getEvents();

events.forEach((event: Event) => {
  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args));
  }
});

export default bot;
