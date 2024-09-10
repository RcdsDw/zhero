/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Event {
    name: string;
    once: boolean;
    execute: (...args: any[]) => void;
}
