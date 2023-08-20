[![Hathora Deploy](https://github.com/philihp/dark-forest/actions/workflows/deploy.yml/badge.svg)](https://github.com/philihp/dark-forest/actions/workflows/deploy.yml)
[![Coverage Status](https://coveralls.io/repos/github/philihp/dark-forest/badge.svg?branch=main)](https://coveralls.io/github/philihp/dark-forest?branch=main)

# Dark Forest

## Architecture

### [Game](https://github.com/philihp/dark-forest/tree/main/game)

All game logic is contained in here. Game state is stored in a `state` object, with a `reducer` processing every command, which is sent to it as a plain string. Every move is processed deterministically, so it can be done simultaneously on both client and server.

### [Server](https://github.com/philihp/dark-forest/blob/main/server/impl.ts)

This serves mostly as a bridge between Game logic and the Hathora server, and handles users joining the game, and throwing out invalid moves which the Game logic processes and returns an undefined state.

### [Client](https://github.com/philihp/dark-forest/tree/main/client/web/src)

Built in plain React, a lot of the bridging to the server is handled in context/GameContext.tsx. The main game's view is in pages/Game.tsx, and is graphics are just a plain inline SVG.
