import { PCGState } from 'fn-pcg/dist/types'
import { GameState, Tableau } from './types'

export const initialState: GameState = {
  randGen: {} as PCGState,
  speed: 1,
  players: [],
  sols: [],
  transits: [],
}

export const initialTableau: Tableau = {
  money: 0,
}
