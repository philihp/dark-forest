import { findIndex, propEq } from 'ramda';
import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  EngineUser,
  EngineState,
  UserId,
  IInitializeRequest,
  IJoinRequest,
  IStartRequest,
  IMoveRequest,
} from "../api/types";
import {
  reducer, initialState, GameState
} from 'dark-forest-game';

type InternalUser = {
  id: UserId
  name: string
  picture: string
  color: string
}

type InternalState = {
  users: InternalUser[]
  game: GameState
}

const colors = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
]


export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      users: [],
      game: initialState
    }
  }

  join(state: InternalState, userId: UserId, ctx: Context, request: IJoinRequest): Response {
    const { picture, name } = request
    const foundPlayerIndex = findIndex(propEq(userId, 'id'), state.users)
    if(foundPlayerIndex !== -1)
      return Response.error(`Already joined as player ${foundPlayerIndex}`);
    if(state.users.length === 12)
      return Response.error(`Already have maximum ${state.users.length} players`);
    state.users.push({ id: userId, name, picture, color: colors[state.users.length] })
    return Response.ok()
  }

  start(state: InternalState, userId: UserId, ctx: Context, request: IStartRequest): Response {
    const { size } = request
    const command = [`${ctx.time}`, 'START', size]
    const newGame = reducer(command)(state.game) as GameState
    if(newGame === undefined) return Response.error(`Unable to start with ${command.join(' ')}`)
    state.game = newGame
    return Response.ok()
  }

  move(state: InternalState, userId: UserId, ctx: Context, request: IMoveRequest): Response {
    const command = request.command.split(/\s+/)
    const nextGame = reducer(command)(state.game) as GameState
    if(nextGame === undefined) return Response.error(`Invalid command ${command.join(' ')}`)
    state.game = nextGame
    return Response.ok()
  }

  getUserState(state: InternalState, userId: UserId): EngineState {
    const users: EngineUser[] = state.users
    const me = state.users.find(u => u.id === userId)

    return {
      users,
      me,
      players: state.game.players,
      sols: state.game.sols,
      transits: state.game.transits,
    }
  }
}
