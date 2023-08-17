import { match, P } from 'ts-pattern'
import { any } from 'ramda'
import { GameCommand, GameState } from './types'
import { start, spawn } from './commands'

export const reducer = (state: GameState, [command, ...params]: string[]): GameState | undefined => {
  return match<[string, string[]], GameState | undefined>([command, params])
    .with([GameCommand.START, P.array(P.string)], ([_, params]) => {
      const sols = Number.parseInt(params[0], 10)
      const seed = Number.parseInt(params[1], 10)
      if (Number.isNaN(seed)) {
        return start(state, { sols, seed: undefined })
      }
      return start(state, { sols, seed })
    })
    .with([GameCommand.SPAWN, [P.string, P.string]], ([_, params]) => {
      const player = Number.parseInt(params[0], 10)
      const sol = Number.parseInt(params[1], 10)
      if (any(Number.isNaN, [sol, player])) {
        return undefined
      }
      return spawn(state, { sol, player })
    })
    .otherwise((command) => {
      throw new Error(`Unable to parse [${command.join(',')}]`)
    })
}
