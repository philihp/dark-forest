import { initialState } from '../../state'
import { Sol } from '../../types'
import { spawn } from '../spawn'

describe('commands/start', () => {
  it('spawns on happy path', () => {
    const s1 = {
      ...initialState,
      sols: [
        { owner: undefined, path: [] },
        { owner: undefined, path: [] },
        { owner: undefined, path: [] },
        { owner: undefined, path: [] },
      ],
      players: [{ money: 0 }, { money: 0 }],
    }
    const s2 = spawn({ time: 100, sol: 2, player: 0 })(s1)!
    expect(s2.sols[2]).toMatchObject({ owner: 0 })
    expect(s2.sols[2].path).toBe(s1.sols[2].path)

    // and nothing else changes
    expect(s2.sols[0]).toBe(s1.sols[0])
    expect(s2.sols[1]).toBe(s1.sols[1])
    expect(s2.sols[3]).toBe(s1.sols[3])
    expect(s2.players).toBe(s1.players)
  })
  it('keeps undefined state', () => {
    const result = spawn({ time: 100, sol: 0, player: 0 })(undefined!)
    expect(result).toBeUndefined()
  })
  it('cannot spawn unless game has started with some sols', () => {
    const s1 = {
      ...initialState,
    }
    const s2 = spawn({ time: 100, sol: 3, player: 0 })(s1)
    expect(s2).toBeUndefined()
  })
  it('spawning on a system that doesnt exist is undefined', () => {
    const o1 = {
      owner: undefined,
      path: [],
    } as Sol
    const s1 = {
      ...initialState,
      sols: [o1, o1, o1, o1],
    }
    const s2 = spawn({ time: 100, sol: 4, player: 0 })(s1)
    expect(s2).toBeUndefined()
  })
  it('cannot spawn when player already has a system', () => {
    const player = 1
    const o1 = {
      owner: undefined,
      path: [],
    } as Sol
    const s1 = {
      ...initialState,
      sols: [o1, o1, { owner: player, path: [] }, o1],
    }
    const s2 = spawn({ time: 100, sol: 1, player })(s1)
    expect(s2).toBeUndefined()
  })
})
