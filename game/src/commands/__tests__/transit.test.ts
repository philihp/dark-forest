import { initialState } from '../../state'
import { Sol } from '../../types'
import { transit } from '../transit'

describe('commands/transit', () => {
  it('transits on happy path', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
    }
    const s2 = transit({ player: 0, source: 2, destination: 1, time: 10000 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 10000, source: 2, destination: 1 }])
    // and nothing else changes
    expect(s2.sols).toBe(s1.sols)
  })
  it('keeps undefined state', () => {
    const result = transit({ player: 0, source: 2, destination: 1, time: 10000 })(undefined!)
    expect(result).toBeUndefined()
  })
  it('cannot transit someone elses system', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
    }
    const result = transit({ player: 1, source: 2, destination: 1, time: 10000 })(s1)
    expect(result).toBeUndefined()
  })
  it('transit to own system keeps sols identity', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 1, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
      transits: [{ departed: 10100, source: 0, destination: 1 }],
    }
    const s2 = transit({ player: 1, source: 1, destination: 2, time: 13000 })(s1)!
    expect(s2.sols).toBe(s1.sols)
  })
  it('removes old transits', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
      transits: [
        { departed: 10100, source: 1, destination: 2 },
        { departed: 10110, source: 2, destination: 3 },
        { departed: 10120, source: 3, destination: 0 },
      ],
    }
    const s2 = transit({ player: 1, source: 2, destination: 1, time: 11111 })(s1)!

    expect(s2?.transits).toStrictEqual([
      { departed: 10120, source: 3, destination: 0 },
      { departed: 11111, source: 2, destination: 1 },
    ])
  })

  it('sets initial source to destination path', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
      transits: [
        { departed: 10100, source: 1, destination: 2 },
        { departed: 10110, source: 2, destination: 3 },
        { departed: 10120, source: 3, destination: 0 },
      ],
    }
    const s2 = transit({ player: 1, source: 2, destination: 1, time: 11111 })(s1)!

    expect(s2.sols).toStrictEqual([
      s1.sols[0],
      { owner: 1, path: [2] },
      { owner: 1, path: [] },
      s1.sols[3], // player 0 should not land, because immediately before player 1 landed on that transit's source
    ])
  })

  it('extends already extended paths', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [1, 2] },
        { owner: 0, path: [2] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [{ departed: 10100, source: 2, destination: 3 }],
    }
    const s2 = transit({ player: 1, source: 4, destination: 3, time: 11111 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 11111, source: 4, destination: 3 }])
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [1, 2, 3] },
      { owner: 0, path: [2, 3] },
      { owner: 0, path: [3] },
      { owner: 0, path: [] },
      { owner: 1, path: [] },
    ])
  })
})
