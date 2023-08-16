import { match, P } from 'ts-pattern'
import { GameCommand, GameState } from './types'
import { start } from './commands'

export const reducer = (state: GameState, [command, ...params]: string[]): GameState | undefined => {
  return match<[string, string[]], GameState | undefined>([command, params])
    .with([GameCommand.START, P.array(P.string)], ([_, params]) => {
      const sols = Number.parseInt(params[0], 10)
      const seed = Number.parseInt(params[1], 10)
      if (Number.isNaN(seed)) {
        return start(state as GameState, {
          sols,
          seed: undefined,
        })
      }
      return start(state as GameState, {
        sols,
        seed,
      })
    })
    .otherwise((command) => {
      throw new Error(`Unable to parse [${command.join(',')}]`)
    })
}
