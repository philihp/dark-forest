import { match, P } from 'ts-pattern'
import { always, any } from 'ramda'
import { GameCommand, GameState, StateReducer } from './types'
import { start, spawn, transit } from './commands'

export const reducer = ([timeRaw, playerRaw, command, ...params]: string[]): StateReducer => {
  const time = Number.parseInt(timeRaw, 10)
  const player = Number.parseInt(playerRaw, 10)
  if (any(Number.isNaN, [time, player])) return always(undefined)
  return (state) =>
    match<[string, string[]], GameState | undefined>([command, params])
      .with([GameCommand.START, P.array(P.string)], ([_, params]) => {
        const sols = Number.parseInt(params[0], 10)
        const seed = Number.parseInt(params[1], 10)
        if (Number.isNaN(sols)) return undefined
        if (Number.isNaN(seed)) return start({ sols, seed: undefined })(state)
        return start({ sols, seed })(state)
      })
      .with([GameCommand.SPAWN, [P.string]], ([_, params]) => {
        const sol = Number.parseInt(params[0], 10)
        if (Number.isNaN(sol)) return undefined
        return spawn({ time, sol, player })(state)
      })
      .with([GameCommand.TRANSIT, [P.string, P.string]], ([_, params]) => {
        const source = Number.parseInt(params[0], 10)
        const destination = Number.parseInt(params[1], 10)
        if (any(Number.isNaN, [source, destination])) return undefined
        return transit({ time, player, source, destination })(state)
      })
      .otherwise(() => undefined)
}
