import { find, findIndex, propEq } from 'ramda';
import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  EngineTableau,
  EngineUser,
  EngineState,
  UserId,
  IInitializeRequest,
  IJoinRequest,
  IStartRequest,
  IMoveRequest,
  IUndoRequest,
  IRedoRequest,
  IControlRequest,
} from "../api/types";
import {
  reducer, initialState, GameState, Tableau, control
} from 'dark-forest-game';

type InternalUser = {
  id: UserId
  name: string
  picture: string
  color: string
}

type InternalState = {
  users: InternalUser[]
  active: boolean
  gameState: GameState[]
  commands: string[]
  commandIndex: number
  partial: string
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

const tokenizePartial = (partial: string): string[] => {
  const out = partial.split(/\s+/)
  if(out.length === 1 && out[0] === '') return []
  return out
}

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      users: [],
      active: false,
      gameState: [],
      commands: [],
      commandIndex: 0,
      partial: '',
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
    const s0 = initialState

    const startParams = ['START', `${ctx.chance.natural({min: 1, max: 999999999})}`]
    const s1 = reducer(s0, startParams) as GameState
    if(!s1) return Response.error(`Unable to start with ${startParams.join(' ')}`)

    state.gameState = [s1]
    state.commands = [
      startParams.join(' ')
    ]
    state.commandIndex = 1
    return Response.ok()
  }

  move(state: InternalState, userId: UserId, ctx: Context, request: IMoveRequest): Response {
    const currState = state.gameState[state.commandIndex - 1]

    const command = request.command.split(/\s+/)
    const nextState = reducer(currState, command) as GameState
    if(nextState === undefined) return Response.error(`Invalid command ${command}`)

    state.gameState = [
      ...state.gameState.slice(0, state.commandIndex),
      nextState
    ]
    state.commands = [
      ...state.commands.slice(0, state.commandIndex),
      request.command
    ]
    state.commandIndex++
    return Response.ok()
  }

  control(state: InternalState, userId: string, ctx: Context, request: IControlRequest): Response {
    state.partial = request.partial
    return Response.ok()
  }

  undo(state: InternalState, userId: string, ctx: Context, request: IUndoRequest): Response {
    if(state.commandIndex <= 2) return Response.error('Cannot undo past beginning')
    state.commandIndex--;
    state.partial = ""
    return Response.ok()
  }

  redo(state: InternalState, userId: string, ctx: Context, request: IRedoRequest): Response {
    if(state.commandIndex >= state.commands.length) return Response.error('Cannot redo past end of commands')
    state.commandIndex++;
    state.partial = ""
    return Response.ok()
  }

  getUserState(state: InternalState, userId: UserId): EngineState {
    if(!state.commandIndex) {
      return {
        users: state.users as EngineUser[],
        me: state.users.find(u => u.id === userId),
        moves: [],
        control: undefined,
      }
    }

    const currState = state.gameState[state.commandIndex -1] as GameState
    const users: EngineUser[] = state.users
    const me = state.users.find(u => u.id === userId)
    const moves = state.commands.slice(0, state.commandIndex)

    const partial = tokenizePartial(state.partial)
    const controlSurface = control(currState, partial)
    const controlState = {
      partial: controlSurface.partial && controlSurface.partial.join(' '),
      completion: controlSurface.completion
    }

    return {
      users,
      me,
      moves,
      players: currState.players.map(
        (player:Tableau) => player as EngineTableau
      ),
      control: controlState
    }
  }
}
