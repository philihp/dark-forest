import { GameCommandTransitParams, StateReducer } from '../types'

export const transit =
  ({ player, departed, source, destination }: GameCommandTransitParams): StateReducer =>
  (state) => {
    if (state === undefined) return state
    if (state.sols[source]?.owner !== player) return undefined
    return {
      ...state,
      transits: [
        ...state.transits,
        {
          departed,
          source,
          destination,
        },
      ],
    }
  }
