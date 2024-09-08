import { ButtonInteraction } from 'discord.js';

export interface Button {
    id: string|RegExp ;
    execute: (interaction: ButtonInteraction) => void;
}
