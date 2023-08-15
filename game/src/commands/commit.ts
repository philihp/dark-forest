import { always, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { GameCommand, GameState, StateReducer } from '../types'

const checkCanCommit: StateReducer = (state) => {
  if (state === undefined) return undefined
  return state
}

export const commit: StateReducer = pipe(
  //
  checkCanCommit
)

export const complete =
  (state: GameState) =>
  (partial: string[]): string[] => {
    return match<string[], string[]>(partial)
      .with([], () => {
        if (checkCanCommit(state) === undefined) return []
        return [GameCommand.COMMIT]
      })
      .with([GameCommand.COMMIT], () => [''])
      .otherwise(always([]))
  }
