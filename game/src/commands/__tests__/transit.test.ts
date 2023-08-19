import { initialState } from '../../state'
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
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 10000, source: 1, destination: 0 },
        { departed: 10001, source: 3, destination: 4 },
        { departed: 10002, source: 4, destination: 1 },
      ],
    }
    const s2 = transit({ player: 0, source: 2, destination: 1, time: 20000 })(s1)!

    expect(s2?.transits).toStrictEqual([
      { departed: 10001, source: 3, destination: 4 },
      { departed: 20000, source: 2, destination: 1 },
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
      transits: [],
    }
    const s2 = transit({ player: 0, source: 2, destination: 3, time: 10000 })(s1)!
    const s3 = transit({ player: 1, source: 1, destination: 3, time: 40000 })(s2)!

    expect(s3.sols).toStrictEqual([
      { owner: undefined, path: [] },
      { owner: 1, path: [] },
      { owner: 0, path: [3] },
      { owner: 0, path: [] },
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
    const s2 = transit({ player: 1, source: 4, destination: 3, time: 30000 })(s1)!

    expect(s2?.transits).toStrictEqual([{ departed: 30000, source: 4, destination: 3 }])
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [1, 2, 3] },
      { owner: 0, path: [2, 3] },
      { owner: 0, path: [3] },
      { owner: 0, path: [] },
      { owner: 1, path: [] },
    ])
  })

  it('truncates existing paths, when starting a new transit', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [1, 2, 3] },
        { owner: 0, path: [2, 3] },
        { owner: 0, path: [3] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [],
    }
    const s2 = transit({ time: 0, player: 0, source: 1, destination: 4 })(s1)!
    expect(s2.sols[0].path).toStrictEqual([1])
    expect(s2.sols[1].path).toStrictEqual([])
    expect(s2.sols[2].path).toStrictEqual([3])
    expect(s2.sols[3].path).toStrictEqual([])
    expect(s2.sols[4].path).toStrictEqual([])
    expect(s2).toMatchObject({
      transits: [{ departed: 0, source: 1, destination: 4 }],
    })
  })

  it('clears existing transits from source', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [1, 2, 3] },
        { owner: 0, path: [2, 3] },
        { owner: 0, path: [3] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [
        { departed: 10, source: 2, destination: 3 },
        { departed: 20, source: 1, destination: 4 },
      ],
    }
    const s2 = transit({ time: 30, player: 0, source: 1, destination: 3 })(s1)!
    expect(s2.sols[0].path).toStrictEqual([1])
    expect(s2.sols[1].path).toStrictEqual([])
    expect(s2.sols[2].path).toStrictEqual([3])
    expect(s2.sols[3].path).toStrictEqual([])
    expect(s2.sols[4].path).toStrictEqual([])
    expect(s2).toMatchObject({
      transits: [
        { departed: 10, source: 2, destination: 3 },
        { departed: 30, source: 1, destination: 3 },
      ],
    })
  })

  it('clears path by setting source to destination', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [1, 2, 3] },
        { owner: 0, path: [2, 3] },
        { owner: 0, path: [3] },
        { owner: 0, path: [] },
        { owner: 1, path: [] },
      ],
      transits: [],
    }
    const s2 = transit({ time: 444, player: 0, source: 0, destination: 0 })(s1)!
    expect(s2.sols[0].path).toStrictEqual([])
    expect(s2.sols[1].path).toStrictEqual([2, 3])
    expect(s2.sols[2].path).toStrictEqual([3])
    expect(s2.sols[3].path).toStrictEqual([])
    expect(s2.sols[4].path).toStrictEqual([])
    expect(s2).toMatchObject({
      transits: [],
    })
  })

  it('cutting off a supply line', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [1, 2, 3, 4] }, // zero
        { owner: 0, path: [2, 3, 4] }, // zero
        { owner: 0, path: [3, 4] }, // zero
        { owner: 0, path: [4] }, // zero
        { owner: 0, path: [] }, // force of strength five at sol 4
        { owner: 1, path: [] }, // force of strength one at sol 5
      ],
      transits: [{ departed: 0, source: 5, destination: 2 }],
    }
    const s2 = transit({ time: 15000, player: 0, source: 4, destination: 5 })(s1)!
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [1] }, // zero
      { owner: 0, path: [] }, // zero
      { owner: 1, path: [] }, // zero
      { owner: 0, path: [4] }, // zero
      { owner: 0, path: [] }, // force of strength five at sol 4
      { owner: 1, path: [2] }, // force of strength one at sol 5
    ])
  })

  it('does not cut its own supply line', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: 0, path: [] }, // one
        { owner: 0, path: [2, 3, 4] }, // zero
        { owner: 0, path: [3, 4] }, // zero
        { owner: 0, path: [4] }, // zero
        { owner: 0, path: [] }, // force of strength five at sol 4
        { owner: 1, path: [] }, // force of strength one at sol 5
      ],
      transits: [{ departed: 0, source: 0, destination: 2 }],
    }
    const s2 = transit({ time: 15000, player: 0, source: 4, destination: 5 })(s1)!
    expect(s2.sols).toStrictEqual([
      { owner: 0, path: [2] },
      { owner: 0, path: [2, 3, 4] },
      { owner: 0, path: [3, 4] },
      { owner: 0, path: [4] },
      { owner: 0, path: [] },
      { owner: 1, path: [] },
    ])
  })
})
