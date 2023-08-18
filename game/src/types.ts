import { PCGState } from 'fn-pcg/dist/types'

export enum GameCommand {
  SPAWN = 'SPAWN',
  START = 'START',
  TRANSIT = 'TRANSIT',
  TICK = 'TICK',
}

export type Tableau = {
  money: number
}

export type GameCommandStartParams = {
  sols: number
  seed?: number
}

export type GameCommandSpawnParams = {
  time: number
  player: number
  sol: number
}

export type GameCommandTransitParams = {
  player: number
  time: number
  source: number
  destination: number
}

export type GameCommandTickParams = {
  time: number
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
