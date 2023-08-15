import { initialState } from '../../state'
import { commit } from '../commit'

describe('commands/commit', () => {
  describe('commit', () => {
    it('can commit from setup', () => {
      const s1 = commit(initialState)!
      expect(s1).toBeDefined()
    })
  })
})
