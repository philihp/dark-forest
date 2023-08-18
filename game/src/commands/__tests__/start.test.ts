import { initialState } from '../../state'
import { start } from '../start'

describe('commands/start', () => {
  it('can start with a seed', () => {
    const dst = start({ seed: 1, sols: 0 })({ ...initialState })
    expect(dst).toBeDefined()
  })

  it('can start with a missing seed', () => {
    const dst = start({ seed: undefined, sols: 0 })({ ...initialState })
    expect(dst).toBeDefined()
  })

  it('creates an array of sols when started', () => {
    const dst = start({ sols: 10 })({ ...initialState })
    expect(dst?.sols).toHaveLength(10)
  })
})
