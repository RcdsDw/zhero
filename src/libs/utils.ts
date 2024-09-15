const randomEnumKey = (enumeration: { [s: string]: string }): string => {
    const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
    const enumKey = keys[Math.floor(Math.random() * keys.length)];
    return enumKey;
};

const randomEnumValue = (enumeration: { [s: string]: string }): string => enumeration[randomEnumKey(enumeration)];

export { randomEnumKey, randomEnumValue };
