const randomEnumKey = (enumeration: any): any => {
    const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
    const enumKey = keys[Math.floor(Math.random() * keys.length)];
    return enumKey;
};

const randomEnumValue = (enumeration: any): any => enumeration[randomEnumKey(enumeration)];

const clamp = (number: number, min: number, max: number): number => Math.max(min, Math.min(number, max));

export { randomEnumKey, randomEnumValue, clamp };
