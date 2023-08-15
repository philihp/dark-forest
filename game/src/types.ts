import { PCGState } from 'fn-pcg/dist/types'

export enum GameCommand {
  START = 'START',
  COMMIT = 'COMMIT',
}

export type Tableau = {
  money: number[]
}

export type GameCommandStartParams = {
  seed?: number
}

export type GameActionCommit = { command: GameCommand.COMMIT }

export type GameState = {
  randGen?: PCGState
  players: Tableau[]
}

export type StateReducer = (state: GameState) => GameState | undefined

export type Controls = {
  partial?: string[]
  completion?: string[]
}
