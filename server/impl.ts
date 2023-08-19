import { assoc, equals, filter, find, findIndex, map, pathSatisfies, propEq, propSatisfies, when } from 'ramda';
import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  EngineUser,
  EngineState,
  UserId,
  IInitializeRequest,
  IJoinRequest,
  IMoveRequest,
  EngineSol,
  EngineTransit,
} from "../api/types";
import {
  reducer, initialState, GameState
} from 'dark-forest-game';
import { Sol, Transit } from 'dark-forest-game/dist/types';

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
  '#fbb4ae',
  '#b3cde3',
  '#ccebc5',
  '#decbe4',
  '#fed9a6',
  '#ffffcc',
  '#e5d8bd',
  '#fddaec',
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

  move(state: InternalState, userId: UserId, ctx: Context, request: IMoveRequest): Response {
    const player = findIndex( (u) => u.id === userId, state.users)
    if(player === -1) {
      console.log('User is not a player of this game.')
      return Response.error('User is not a player of this game.')
    }

    const params = [ `${ctx.time}`, `${player}`, ...request.command.split(/\s+/) ]
    const nextGame = reducer(params)(state.game)
    if(nextGame === undefined) {
      console.log(`ERROR ${params}`)
      return Response.error(`ERROR ${params.join(' ')}`)
    }
    state.game = nextGame
    return Response.ok()
  }

  getUserState(state: InternalState, userId: UserId): EngineState {
    const users: EngineUser[] = state.users
    const me = find(u => u.id === userId, state.users)
    const playerIndex = findIndex(u => u.id === userId, state.users)

    return {
      users,
      me,
      sols: map<Sol, EngineSol>(
        (sol: Sol) => {
          if(sol.owner === playerIndex) return sol
          return {
            owner: sol.owner,
            path: []
          }
        },
        state.game.sols
      ),
      transits: state.game.transits.filter(
        (transit) => state.game.sols[transit.source].owner === playerIndex
      ),
    }
  }

  onTick(state: InternalState, ctx: Context, timeDelta: number): void {
    if(state.game === initialState) return
    if(state.users.length === 0) return
    const params = [`${ctx.time}`, '0', 'TICK']
    const nextGame = reducer(params)(state.game)
    if(nextGame !== undefined) state.game = nextGame
  }
}
