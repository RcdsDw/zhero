import { Collection } from "discord.js";
import { Command } from "./interfaces/command";

export declare module 'discord.js' {
    interface Client {
      commands: Collection<string, Command>;
    }
  }