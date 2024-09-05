import { Collection } from 'discord.js';
import { Command } from './interfaces/command';
import { Button } from './interfaces/button';

export declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, Button>;
  }
}
