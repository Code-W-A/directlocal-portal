import data from "@/content/images.json";
export const images = data;
export function getImage(id?: string) { return images.find(image => image.id === id); }
