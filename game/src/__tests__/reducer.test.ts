import { reducer } from '../reducer'
import { initialState } from '../state'
import { start, spawn, transit } from '../commands'

jest.mock('../commands', () => {
  return {
    ...jest.requireActual('../commands'),
    spawn: jest.fn().mockReturnValue(jest.fn()),
    start: jest.fn().mockReturnValue(jest.fn()),
    transit: jest.fn().mockReturnValue(jest.fn()),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('reducer', () => {
  const s0 = {
    ...initialState,
    sols: [
      { owner: undefined, path: [] },
      { owner: 1, path: [] },
      { owner: 0, path: [] },
      { owner: undefined, path: [] },
    ],
    players: [{ money: 0 }, { money: 0 }],
  }

  it('handles unfound commands', () => {
    const result = reducer(['FOFOFOFOFOFO'])(s0)
    expect(result).toBeUndefined()
  })

  describe('initialState', () => {
    it('exposes an initial state', () => {
      expect.assertions(1)
      expect(initialState).toBeDefined()
    })
  })

  describe('start', () => {
    it('calls start with sols and seed', () => {
      const expectedParams = { seed: 42, sols: 100 }
      reducer(['START', '100', '42'])(s0)!
      expect(start).toHaveBeenCalledWith(expectedParams)
      expect(start(expectedParams)).toHaveBeenCalledWith(s0)
    })
    it('calls start with sols if seed missing', () => {
      const expectedParams = { seed: undefined, sols: 100 }
      reducer(['START', '100'])(s0)!
      expect(start).toHaveBeenCalledWith(expectedParams)
      expect(start(expectedParams)).toHaveBeenCalledWith(s0)
    })
    it('returns undefined reducer when invalid param', () => {
      const nextState = reducer(['START', 'aaa'])(s0)!
      expect(start).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
  })

  describe('spawn', () => {
    it('spawns a player at sol 4', () => {
      const expectedParams = { player: 0, sol: 4 }
      reducer(['SPAWN', '0', '4'])(s0)!
      expect(spawn).toHaveBeenCalledWith(expectedParams)
      expect(spawn(expectedParams)).toHaveBeenCalledWith(s0)
    })
    it('returns undefined reducer when invalid player', () => {
      const nextState = reducer(['SPAWN', 'aaa', '4'])(s0)!
      expect(spawn).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
    it('returns undefined reducer when invalid sol', () => {
      const nextState = reducer(['SPAWN', '0', 'aaa'])(s0)!
      expect(spawn).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
  })

  describe('transit', () => {
    it('transits a player from 0 to 2', () => {
      const expectedParams = { time: 1321855, player: 0, source: 2, destination: 1 }
      reducer(['TRANSIT', '1321855', '0', '2', '1'])(s0)!
      expect(transit).toHaveBeenCalledWith(expectedParams)
      expect(transit(expectedParams)).toHaveBeenCalledWith(s0)
    })
    it('returns undefined reducer when invalid time', () => {
      const nextState = reducer(['TRANSIT', '1', '12457751', 'aaa', '4'])(s0)!
      expect(transit).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
    it('returns undefined reducer when invalid player', () => {
      const nextState = reducer(['TRANSIT', 'aaa', '12457751', '1', '4'])(s0)!
      expect(transit).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
    it('returns undefined reducer when invalid src', () => {
      const nextState = reducer(['TRANSIT', '1', '1237732', 'aaa', '3'])(s0)!
      expect(transit).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
    it('returns undefined reducer when invalid dst', () => {
      const nextState = reducer(['TRANSIT', '0', '12378217', '4', 'aaa'])(s0)!
      expect(transit).not.toHaveBeenCalled()
      expect(nextState).toBeUndefined()
    })
  })
})
