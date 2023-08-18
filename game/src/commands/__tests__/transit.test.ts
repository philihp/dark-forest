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
      players: [{ money: 0 }, { money: 0 }],
    }
    const s2 = transit({ player: 0, source: 2, destination: 1, time: 10000 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 10000, source: 2, destination: 1 }])
    // and nothing else changes
    expect(s2.players).toBe(s1.players)
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
      players: [{ money: 0 }, { money: 0 }],
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
      players: [{ money: 0 }, { money: 0 }],
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
      players: [{ money: 0 }, { money: 0 }],
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
    expect(s2.sols).toStrictEqual([
      s1.sols[0],
      { owner: 1, path: [] },
      { owner: 1, path: [] },
      s1.sols[3], // player 0 should not land, because immediately before player 1 landed on that transit's source
    ])
    // and nothing else changes
    expect(s2.players).toBe(s1.players)
  })
})
