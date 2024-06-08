export type Color = [number, number, number];
export enum ColorTag {
  red = 'Red',
  green = 'Green',
  blue = 'Blue',
}
export interface ColorTargeted {
  value: number;
  tag: ColorTag;
  tagIndex: number;
  rgb: string
}
