import { GameState } from '../..'
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
  })
  it('does not come back undefined on a standard tick', () => {
    const s1: GameState = {
      speed: 1,
      players: [
        {
          money: 0,
        },
      ],
      sols: [
        {
          path: [],
        },
        {
          path: [],
        },
        {
          path: [],
        },
        {
          owner: 0,
          path: [],
        },
        {
          path: [],
        },
        {
          path: [],
        },
        {
          path: [],
        },
      ],
      transits: [
        {
          departed: 1692341379006,
          source: 3,
          destination: 0,
        },
      ],
    }
    const s2 = tick({ time: 1692341606751 })(s1)
    expect(s2).toMatchObject({
      ...s1,
      transits: [],
      sols: [
        {
          path: [],
          owner: 0,
        },
        {
          path: [],
        },
        {
          path: [],
        },
        {
          owner: 0,
          path: [0],
        },
        {
          path: [],
        },
        {
          path: [],
        },
        {
          path: [],
        },
      ],
    })
  })
})
