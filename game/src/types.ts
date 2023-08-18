import { PCGState } from 'fn-pcg/dist/types'

export enum GameCommand {
  START = 'START',
  SPAWN = 'SPAWN',
  TRANSIT = 'TRANSIT',
}

export type Tableau = {
  money: number
}

export type GameCommandStartParams = {
  sols: number
  seed?: number
}

export type GameCommandSpawnParams = {
  player: number
  sol: number
}

export type GameCommandTransitParams = {
  player: number
  time: number
  source: number
  destination: number
}

export type Sol = {
  owner?: number
  path: number[]
}

export type Transit = {
  departed: number
  source: number
  destination: number
}

export type GameState = {
  randGen?: PCGState
  speed: number
  players: Tableau[]
  sols: Sol[]
  transits: Transit[]
}

export type StateReducer = (state?: GameState) => GameState | undefined
