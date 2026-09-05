// Compact bitmap letterforms keep the name deliberately blocky at every size.
const letters: Record<string, string[]> = {
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  i: ['010', '000', '110', '010', '010', '010', '111'],
  a: ['00000', '00000', '01110', '00001', '01111', '10001', '01111'],
  r: ['0000', '0000', '1011', '1100', '1000', '1000', '1000'],
  u: ['00000', '00000', '10001', '10001', '10001', '10001', '01111'],
  n: ['00000', '00000', '11110', '10001', '10001', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  b: ['10000', '10000', '11110', '10001', '10001', '10001', '11110'],
  o: ['00000', '00000', '01110', '10001', '10001', '10001', '01110'],
  t: ['010', '010', '111', '010', '010', '010', '011'],
  m: ['0000000', '0000000', '1101110', '1010101', '1010101', '1010101', '1010101'],
  e: ['00000', '00000', '01110', '10001', '11111', '10000', '01111'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
};

export const binaryGlyphs = [
  ['111', '101', '101', '101', '111'],
  ['010', '110', '010', '010', '111'],
];

export type BinaryPoint = { x: number; y: number; column: number; digit: 0 | 1 };

function bitmap(text: string, subdivisions: number, weight: number) {
  const word = Array.from(text);
  const columns = word.reduce((sum, letter) => sum + letters[letter][0].length, 0) + word.length - 1;
  const gridWidth = columns * subdivisions + 2 * weight;
  const gridHeight = 7 * subdivisions + 2 * weight;
  const occupied = new Set<number>();
  let offset = 0;
  word.forEach((letter) => {
    letters[letter].forEach((row, y) => {
      Array.from(row).forEach((pixel, x) => {
        if (pixel !== '1') return;
        for (let subY = -weight; subY < subdivisions + weight; subY++) {
          for (let subX = -weight; subX < subdivisions + weight; subX++) {
            const column = (offset + x) * subdivisions + subX + weight;
            const row = y * subdivisions + subY + weight;
            occupied.add(row * gridWidth + column);
          }
        }
      });
    });
    offset += letters[letter][0].length + 1;
  });
  return { occupied: Array.from(occupied).sort((a,b) => a-b), gridWidth, gridHeight };
}

type Layout = { subdivisions: number; weight: number; tile: number };

function placeText(text: string, width: number, centerY: number, layout: Layout, slant = 0) {
  const { occupied, gridWidth, gridHeight } = bitmap(text, layout.subdivisions, layout.weight);
  const { tile } = layout;
  const fullHeight = gridHeight * tile;
  const fullWidth = (gridWidth + slant * gridHeight) * tile;
  const left = (width - gridWidth * tile) / 2;
  const top = centerY - fullHeight / 2;
  const points: BinaryPoint[] = occupied.map((index) => {
    const column = index % gridWidth;
    const row = Math.floor(index / gridWidth);
    const y = top + (row + .5) * tile;
    return { x: left + (column + .5) * tile + slant * (centerY - y), y, column, digit: (column + row) % 2 as 0 | 1 };
  });
  return { points, digitHeight: tile * .95, fullWidth, fullHeight, layout };
}

export function createBinaryName(width: number, height: number, centerY: number) {
  const targetWidth = Math.min(width * .92, 1720);
  const cell = targetWidth / 48;
  const subdivisions = cell >= 32 ? 4 : cell >= 22 ? 3 : cell >= 12 ? 2 : 1;
  const weight = subdivisions >= 3 ? 1 : 0;
  const { gridWidth, gridHeight } = bitmap('Jiarun Lu', subdivisions, weight);
  const slant = .24;
  // Reserve the italic overhang so the name remains centered and inside the viewport.
  const tile = Math.min(targetWidth / (gridWidth + slant * gridHeight), height * (height < 680 ? .25 : .32) / gridHeight);
  return placeText('Jiarun Lu', width, centerY, { subdivisions, weight, tile }, slant);
}

export function createBinaryAbout(width: number, height: number, layout: Layout) {
  // Keep both the lettering and individual digits upright at the same pixel scale.
  return placeText('About me', width, height * .5, layout);
}

type Position = { x: number; y: number };

export function morphToAbout(home: Position, target: Position, progress: number) {
  const q = Math.max(0, Math.min(1, (progress - .035) / .865));
  const amount = q * q * (3 - 2 * q);
  return { x: home.x + (target.x - home.x) * amount, y: home.y + (target.y - home.y) * amount, amount };
}
