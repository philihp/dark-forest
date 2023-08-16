import { initialState } from '../../state'
import { start } from '../start'

describe('commands/start', () => {
  it('can start with a seed', () => {
    const dst = start(
      {
        ...initialState,
      },
      { seed: 1, sols: 0 }
    )
    expect(dst).toBeDefined()
  })

  it('can start with a missing seed', () => {
    const dst = start(
      {
        ...initialState,
      },
      { seed: undefined, sols: 0 }
    )
    expect(dst).toBeDefined()
  })

  it('creates an array of sols when started', () => {
    const dst = start(
      {
        ...initialState,
      },
      { sols: 10 }
    )
    expect(dst?.sols).toHaveLength(10)
  })
})
