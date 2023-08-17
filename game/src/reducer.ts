import { match, P } from 'ts-pattern'
import { any } from 'ramda'
import { GameCommand, GameState } from './types'
import { start, spawn, transit } from './commands'

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
    .with([GameCommand.TRANSIT, [P.number, P.string, P.string]], ([_, params]) => {
      const departed = Number.parseInt(params[0], 10)
      const source = Number.parseInt(params[0], 10)
      const destination = Number.parseInt(params[0], 10)
      if (any(Number.isNaN, [departed, source, destination])) {
        return undefined
      }
      return transit(state, { departed, source, destination })
    })
    .otherwise((command) => {
      throw new Error(`Unable to parse [${command.join(',')}]`)
    })
}
