import { identity } from 'ramda'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { start, commit } from '../commands'

jest.mock('../commands', () => {
  return {
    ...jest.requireActual('../commands'),
    commit: jest.fn().mockReturnValue(identity),
    start: jest.fn().mockReturnValue(identity),
  }
})

describe('reducer', () => {
  const s0 = {
    ...initialState,
  }

  it('handles unfound commands', () => {
    expect(() => reducer(s0, ['FOFOFOFOFOFO'])).toThrow()
  })

  describe('initialState', () => {
    it('exposes an initial state', () => {
      expect.assertions(1)
      expect(initialState).toBeDefined()
    })
  })

  describe('commit', () => {
    it('calls commit', () => {
      reducer(s0, ['COMMIT'])!
      expect(commit).toHaveBeenCalled()
    })
  })

  describe('start', () => {
    it('calls start', () => {
      reducer(s0, ['START', '42', 'R', 'G', 'B'])!
      expect(start).toHaveBeenCalled()
    })
  })
})
