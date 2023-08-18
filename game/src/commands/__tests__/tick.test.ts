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
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 10000, source: 1, destination: 0 },
        { departed: 10001, source: 2, destination: 4 },
        { departed: 10002, source: 4, destination: 1 },
      ],
    }
    const s2 = tick({ time: 20000 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 10001, source: 2, destination: 4 }])
  })
  it('does not come back undefined on a standard tick', () => {
    const s1: GameState = {
      speed: 1,
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
