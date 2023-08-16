import { identity } from 'ramda'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { start } from '../commands'

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

  describe('start', () => {
    it('calls start with sols and seed', () => {
      reducer(s0, ['START', '100', '42'])!
      expect(start).toHaveBeenCalledWith(initialState, { seed: 42, sols: 100 })
    })
    it('calls start with sols if seed missing', () => {
      reducer(s0, ['START', '100'])!
      expect(start).toHaveBeenCalledWith(initialState, { seed: undefined, sols: 100 })
    })
  })
})
