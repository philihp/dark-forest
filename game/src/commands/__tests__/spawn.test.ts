import { initialState } from '../../state'
import { Sol } from '../../types'
import { spawn } from '../spawn'

describe('commands/start', () => {
  it('cannot spawn unless game has started with some sols', () => {
    const s1 = {
      ...initialState,
    }
    const s2 = spawn(s1, { sol: 3, player: 0 })
    expect(s2).toBeUndefined()
  })
  it('spawning on a system that doesnt exist is undefined', () => {
    const o1 = {
      owner: undefined,
    } as Sol
    const s1 = {
      ...initialState,
      sols: [o1, o1, o1, o1],
    }
    const s2 = spawn(s1, { sol: 4, player: 0 })
    expect(s2).toBeUndefined()
  })
  it('cannot spawn when player already has a system', () => {
    const player = 1
    const o1 = {
      owner: undefined,
    } as Sol
    const s1 = {
      ...initialState,
      sols: [o1, o1, { owner: player }, o1],
    }
    const s2 = spawn(s1, { sol: 1, player })
    expect(s2).toBeUndefined()
  })
})
