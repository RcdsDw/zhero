import { ButtonInteraction } from 'discord.js';

export interface Button {
    id: string;
    execute: (interaction: ButtonInteraction) => void;
}