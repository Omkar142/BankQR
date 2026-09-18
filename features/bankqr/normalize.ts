export const normalizeAccount = (value: string) => value.replace(/[\s-]/g, "");
export const normalizeIfsc = (value: string) => value.trim().toUpperCase();
export const maskAccount = (value: string) => `•••• •••• ${value.slice(-4)}`;
