import { createPcg32 } from 'fn-pcg'
import { map, range } from 'ramda'
import { GameCommandStartParams, GameState, Sol } from '../types'

// we could get more entropy with a second seed, but
// honestly this is fine for now.
const PCG_PERIOD = 69420

// this is a brute-forced seed given the above, which
// results in a noop shuffle for 2, 3, 4, or even 5 elements
const MAGIC_SEED = 2692

export const start = (
  state: GameState,
  { seed = MAGIC_SEED, sols }: GameCommandStartParams
): GameState | undefined => ({
  ...state,
  randGen: createPcg32({}, seed, PCG_PERIOD),
  players: [],
  sols: map(
    (): Sol => ({
      owner: undefined,
      path: [],
    }),
    range(0, sols)
  ),
})
