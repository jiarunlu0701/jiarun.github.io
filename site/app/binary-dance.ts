// Independent phases make the binary texture shimmer without flashing as a block.
export function binaryDance(time: number, seed: number, digit: 0 | 1, height: number, scrollEnergy: number, hover: number, reduced: boolean) {
  if (reduced) return { digit, opacity: 1, x: 0, y: 0 };
  const phase = seed * Math.PI * 2;
  const tick = Math.floor(time / (2400 + seed * 2200) + seed * 17);
  const shimmer = .5 + .5 * Math.sin(time * .0011 + phase);
  const activity = Math.min(1, scrollEnergy + hover * .85);
  const amplitude = Math.min(height * (.07 + activity * .07), .5 + activity * .7);
  return {
    digit: (digit + tick) % 2 as 0 | 1,
    opacity: .76 + .24 * shimmer,
    x: Math.sin(time * .0008 + phase) * amplitude * .7,
    y: Math.cos(time * .0011 + phase * 1.7) * amplitude,
  };
}
