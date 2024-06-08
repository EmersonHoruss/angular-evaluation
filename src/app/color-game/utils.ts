import { Color, ColorTag, ColorTargeted } from './types';

export function getRandomColor(): Color {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

export function rgbString(color: Color) {
  const [r, g, b] = color;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomColors(n: number): Color[] {
  return [...Array(n)].map(() => getRandomColor());
}

export function getStatus(
  attempts: number[],
  target: number,
  numOfColors: number
): 'win' | 'lose' | 'playing' {
  if (attempts.length === numOfColors - 1) return 'lose';
  if (attempts.includes(target)) return 'win';
  return 'playing';
}

export function getColorsTargeted(colors: Color): ColorTargeted[] {
  return Object.entries(ColorTag).map(
    ([_, tag]: [string, ColorTag], index): ColorTargeted => ({
      value: colors[index],
      tag,
      tagIndex: index + 1,
      rgb: index === 0 ? 'red' : index === 1 ? 'green' : 'blue',
    })
  );
}
