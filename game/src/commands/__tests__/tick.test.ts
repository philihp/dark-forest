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

  it('ships travel at 1 unit per second', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 0, source: 1, destination: 5 }, // arrives at 14231
        { departed: 0, source: 0, destination: 3 }, // arrives at 6185
        { departed: 0, source: 2, destination: 4 }, // arrives at 10130
      ],
    }
    const s2 = tick({ time: 5000 })(s1)!
    const s3 = tick({ time: 8000 })(s2)!
    const s4 = tick({ time: 11000 })(s3)!
    const s5 = tick({ time: 15000 })(s4)!
    expect(s2.transits).toHaveLength(3)
    expect(s3.transits).toHaveLength(2)
    expect(s4.transits).toHaveLength(1)
    expect(s5.transits).toHaveLength(0)
  })

  it('transits can be disrupted', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 0, source: 0, destination: 3 }, // arrives at 6185
        { departed: 0, source: 3, destination: 1 }, // arrives at 8578
        { departed: 0, source: 1, destination: 5 }, // arrives at 14231
      ],
    }
    const s2 = tick({ time: 9000 })(s1)! // this tick should collect 2 arrived transits
    expect(s2.transits).toStrictEqual([
      {
        departed: 0,
        destination: 5,
        source: 1,
      },
    ])
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [3] },
      { owner: 0, path: [] },
      { owner: 0, path: [] },
      { owner: 0, path: [] },
      { owner: 1, path: [] },
      { owner: 1, path: [] },
    ])
  })

  it('process transits by arrival time, not ordinal time in array', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 0, source: 3, destination: 1 }, // arrives at 8578
        { departed: 0, source: 0, destination: 3 }, // arrives at 6185
        { departed: 0, source: 1, destination: 5 }, // arrives at 14231
      ],
    }
    const s2 = tick({ time: 9000 })(s1)! // this tick should collect 2 arrived transits
    expect(s2.transits).toStrictEqual([
      {
        departed: 0,
        destination: 5,
        source: 1,
      },
    ])
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [3] },
      { owner: 0, path: [] },
      { owner: 0, path: [] },
      { owner: 0, path: [] },
      { owner: 1, path: [] },
      { owner: 1, path: [] },
    ])
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
