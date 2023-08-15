import { match } from 'ts-pattern'
import { always, head } from 'ramda'
import { GameCommand, GameState, Controls } from './types'
import { completeCommit } from './commands'

export const control = (state: GameState, partial: string[], player?: number): Controls => {
  const completion = match(head(partial))
    .with(undefined, () => [...completeCommit(state)([])])
    .with(GameCommand.COMMIT, () => completeCommit(state)(partial))
    .otherwise(always([]))

  return {
    partial,
    completion,
  }
}
