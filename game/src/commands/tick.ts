import { pipe } from 'ramda'
import { GameCommandTickParams, StateReducer } from '../types'
import { removeExpired } from './action/removeExpired'
import { arriveTransits } from './action/arrive'

export const tick = ({ time }: GameCommandTickParams): StateReducer =>
  pipe(
    //
    arriveTransits(time),
    removeExpired(time)
  )
