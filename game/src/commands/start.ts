import { createPcg32 } from 'fn-pcg'
import { GameCommandStartParams, GameState } from '../types'

// we could get more entropy with a second seed, but
// honestly this is fine for now.
const PCG_PERIOD = 69420

// this is a brute-forced seed given the above, which
// results in a noop shuffle for 2, 3, 4, or even 5 elements
const MAGIC_SEED = 2692

export const start = (state: GameState, { seed }: GameCommandStartParams): GameState | undefined => {
  const seedUsed = seed ?? MAGIC_SEED
  const randGen = createPcg32({}, seedUsed, PCG_PERIOD)

  return {
    ...state,
    randGen,
    players: [],
  }
}
