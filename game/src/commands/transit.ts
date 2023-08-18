import { pipe } from 'ramda'
import { GameCommandTransitParams, StateReducer } from '../types'
import { tick } from './tick'

const checkPlayerOwner =
  (player: number, source: number): StateReducer =>
  (state) => {
    if (state?.sols?.[source]?.owner !== player) return undefined
    return state
  }

const addTransitDeparture =
  (departed: number, source: number, destination: number): StateReducer =>
  (state) => {
    if (state === undefined) return state
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

export const transit = ({ player, time, source, destination }: GameCommandTransitParams): StateReducer =>
  pipe(
    //
    tick({ time }),
    checkPlayerOwner(player, source),
    addTransitDeparture(time, source, destination)
  )
