import { match } from 'ts-pattern'
import { always, head } from 'ramda'
import { GameState, Controls } from './types'

export const control = (_state: GameState, partial: string[], _player?: number): Controls => {
  const completion = match(head(partial))
    // .with(undefined, () => [...completeCommit(state)([])])
    // .with(GameCommand.COMMIT, () => completeCommit(state)(partial))
    .otherwise(always([]))

  return {
    partial,
    completion,
  }
}
