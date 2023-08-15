[![Version](https://img.shields.io/npm/v/dark-forest-game.svg)](https://www.npmjs.com/package/dark-forest-game)
[![Tests](https://github.com/philihp/dark-forest/actions/workflows/game.yml/badge.svg)](https://github.com/philihp/dark-forest/actions/workflows/game.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/dark-forest/badge.svg?branch=main)](https://coveralls.io/github/philihp/dark-forest?branch=main)
![Downloads](https://img.shields.io/npm/dt/dark-forest-game)
![License](https://img.shields.io/npm/l/dark-forest-game)

## Dark Forest Game Logic Library

This is a state engine for playing a game of Dark Forest. I'm working on a UI for this, but
at a minimal level every client and player should agree on the rules expressed by these state transforms. Keeping state-transition
logic separate from UI should also make it simpler to build an offline trainer algorithm to develop a model to play the game against.

Each game state should start out with a state

```js
import { initialState, GameState } from 'dark-forest-game'

const s0: GameState = initialState
```

initialState is the root game state that all games begin from. From here, any number of moves can be done, and the proper order of which is specified by the game itself, but it must conform to this flow, where
any given string will process into another GameState.

```js
import { reducer, GameState } from 'dark-forest-game'

const s1 = reducer(s0, ['START']) as GameState
const s2 = reducer(s1, ['COMMIT']) as GameState
const s3 = reducer(s2, ['COMMIT']) as GameState
const s4 = reducer(s3, ['COMMIT']) as GameState
```

From any given state, we can issue a `control` on the state to append additional metadata information, like the current score, or possible moves from here. This might be CPU intensive, and would be unnecessary when
traversing through known-valid moves.

```js
import { control } from 'dark-forest-game'

const partialCommand: string[] = []
const playerIndex: number = 0
const { completion, partial } = control(state, partial, playerIndex)
```

- `completion` - a list of strings which could be the prefix of the next command from the user.
- `partial` - The current list of params for the current move. `""` is included in this list, then the current partial command could be sent as-is. If this list is empty, the given partial command is invalid.
