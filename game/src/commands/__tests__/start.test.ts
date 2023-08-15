import { initialState } from '../../state'
import { start } from '../start'

describe('commands/start', () => {
  it('can start with a seed', () => {
    const dst = start(
      {
        ...initialState,
      },
      { seed: 1 }
    )
    expect(dst).toBeDefined()
  })

  it('can start with a missing seed', () => {
    const dst = start(
      {
        ...initialState,
      },
      { seed: undefined }
    )
    expect(dst).toBeDefined()
  })
})
