import { coordinates, distance } from '../math'

describe('math', () => {
  describe('coordinates', () => {
    it('has coordinates of point 0', () => {
      const [x, y] = coordinates(0)
      expect(x).toBeCloseTo(2.8284271247461903)
      expect(y).toBeCloseTo(0)
    })
    it('has coordinates of point 1', () => {
      const [x, y] = coordinates(1)
      expect(x).toBeCloseTo(-3.612355007000771)
      expect(y).toBeCloseTo(-3.3092130942863833)
    })
    it('has coordinates of point 2', () => {
      const [x, y] = coordinates(2)
      expect(x).toBeCloseTo(0.5529288323929572)
      expect(y).toBeCloseTo(6.300338856467052)
    })
    it('has coordinates of point 3', () => {
      const [x, y] = coordinates(3)
      expect(x).toBeCloseTo(4.5531395171637605)
      expect(y).toBeCloseTo(-5.9387642264398535)
    })
    it('has coordinates of point 4', () => {
      const [x, y] = coordinates(4)
      expect(x).toBeCloseTo(-8.355570995908547)
      expect(y).toBeCloseTo(1.477982859282151)
    })
    it('has coordinates of point 5', () => {
      const [x, y] = coordinates(5)
      expect(x).toBeCloseTo(7.915126264445094)
      expect(y).toBeCloseTo(5.034955433555639)
    })
  })

  describe('distance', () => {
    it('describes distance from 0 to 3', () => {
      expect(distance(...coordinates(0), ...coordinates(3))).toBeCloseTo(6.1841372376266435)
    })
    it('describes distance from 1 to 5', () => {
      expect(distance(...coordinates(1), ...coordinates(5))).toBeCloseTo(14.23052960660862)
    })
    it('describes distance from 2 to 4', () => {
      expect(distance(...coordinates(2), ...coordinates(4))).toBeCloseTo(10.129979592991939)
    })
    it('describes distance from 3 to 1', () => {
      expect(distance(...coordinates(3), ...coordinates(1))).toBeCloseTo(8.578452073700157)
    })
  })
})
