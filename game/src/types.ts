import { PCGState } from 'fn-pcg/dist/types'

export enum GameCommand {
  START = 'START',
  COMMIT = 'COMMIT',
}

export type Tableau = {
  money: number
}

export type GameCommandStartParams = {
  sols: number
  seed?: number
}

export type GameCommandSpawnParams = {
  sol: number
  player: number
}

export type GameActionCommit = { command: GameCommand.COMMIT }

export type Sol = {
  owner?: number
}

export type GameState = {
  randGen?: PCGState
  players: Tableau[]
  sols: Sol[]
}

export type StateReducer = (state: GameState) => GameState | undefined

export type Controls = {
  partial?: string[]
  completion?: string[]
}
