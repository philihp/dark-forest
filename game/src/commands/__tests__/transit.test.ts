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
})
