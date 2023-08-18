const baseAngle = Math.PI * (1 + Math.sqrt(5))
export const coordinates = (n: number): [number, number] => {
  const r = Math.sqrt(n + 0.5) * 4
  const theta = n * baseAngle
  const x = r * Math.cos(theta)
  const y = r * Math.sin(theta)
  return [x, y]
}
export const distance = (sx: number, sy: number, dx: number, dy: number) => Math.sqrt((sx - dx) ** 2 + (sy - dy) ** 2)
