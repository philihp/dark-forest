import { initialState } from '../../state'
import { tick } from '../tick'

describe('commands/tick', () => {
  it('ticks on happy path', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: 1, path: [] },
        { owner: 0, path: [] },
        { owner: undefined, path: [] },
      ],
      players: [{ money: 0 }, { money: 0 }],
      transits: [],
    }
    const s2 = tick({ time: 10000 })(s1)!

    expect(s2).toBe(s1)
  })
  it('keeps undefined state', () => {
    const result = tick({ time: 10000 })(undefined!)
    expect(result).toBeUndefined()
  })
  it('removes old ticks', () => {
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
    const s2 = tick({ time: 11111 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 10120, source: 3, destination: 0 }])
    expect(s2?.sols?.[2]).toMatchObject({
      owner: 1,
      path: [],
    })
    expect(s2?.sols?.[3]).toMatchObject({
      owner: 1,
      path: [],
    })
    // and nothing else changes
    expect(s2.players).toBe(s1.players)
    expect(s2.sols[0]).toBe(s1.sols[0])
    expect(s2.sols[1]).toBe(s1.sols[1])
  })
})
