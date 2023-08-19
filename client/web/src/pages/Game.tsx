import { useParams } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { append, assoc, dissoc, equals, forEach, last, pipe, reduce, reject } from 'ramda'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'
import { StartButton } from '../components/StartButton'
import { EngineSol } from '../../../../api/types'

const baseAngle = Math.PI * (1 + Math.sqrt(5))
const coordinates = (n: number): [number, number] => {
  const r = Math.sqrt(n + 0.5) * 4
  const theta = n * baseAngle
  const x = r * Math.cos(theta)
  const y = r * Math.sin(theta)
  return [x, y]
}
const distance = (sx: number, sy: number, dx: number, dy: number) => Math.sqrt((sx - dx) ** 2 + (sy - dy) ** 2)

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state, move } = useHathoraContext()
  const [selected, setSelected] = useState<number[]>([])
  const [debug, setDebug] = useState<boolean>(false)
  useAutoConnect(gameId)

  const nodes = state?.sols ?? []
  const edges = state?.transits ?? []

  const handleLeftClick = (n: number) => (e: MouseEvent) => {
    e.preventDefault()
    if (e.shiftKey) return move(`SPAWN ${n}`)
    if (selected.includes(n)) {
      setSelected(reject(equals(n), selected))
    } else {
      setSelected(append(n, selected))
    }
    return undefined
  }

  const handleRightClick = (dst: number) => (e: MouseEvent) => {
    e.preventDefault()
    forEach((src) => {
      console.log(`TRANSIT ${src} ${dst}`)
      move(`TRANSIT ${src} ${dst}`)
    }, selected)
    setSelected([])
    return undefined
  }

  return (
    <>
      <svg
        viewBox="-50 -50 100 100" /* min-x min-y width height */
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '40em', userSelect: 'none', WebkitUserSelect: 'none' }}
        role="img"
      >
        {nodes.map((sol, n) => {
          const [x, y] = coordinates(n)
          const fill = sol.owner === undefined ? '#ddd' : state?.users?.[sol.owner].color
          const power = reduce(
            (sum, sol: EngineSol) => {
              if (last(sol.path) !== n) return sum
              return sum + 1
            },
            sol.path.length === 0 ? 1 : 0,
            nodes
          )
          return (
            <circle
              onClick={handleLeftClick(n)}
              onContextMenu={handleRightClick(n)}
              // eslint-disable-next-line react/no-array-index-key
              key={`dot${n}`}
              cx={`${x}`}
              cy={`${y}`}
              r="2"
              style={{
                fill,
                stroke: '#444',
                strokeWidth: 0.5,
                strokeOpacity: 1 - 0.75 ** power,
                ...(selected.includes(n)
                  ? {
                      strokeDasharray: '0.4',
                      strokeDashoffset: 100,
                      strokeOpacity: 1 - 0.75 ** (power + 1),
                      animation: 'dash 20s linear',
                      animationIterationCount: 'infinite',
                    }
                  : {}),
              }}
            />
          )
        })}
        {nodes.map((sol, n) => {
          // paths from node to wherever it's going
          const { pairs } = reduce(
            ({ prev, pairs }: { prev: number; pairs: [number, number][] }, next: number) => ({
              prev: next,
              pairs: [...pairs, [prev, next]] as [number, number][],
            }),
            { prev: n, pairs: [] as [number, number][] },
            sol.path
          )
          return pairs.map(([source, destination]) => {
            const [sx, sy] = coordinates(source)
            const [dx, dy] = coordinates(destination)
            return (
              <path
                // eslint-disable-next-line react/no-array-index-key
                key={`${n}:${source}:${destination}`}
                d={`M ${sx} ${sy} L ${dx} ${dy}`}
                strokeWidth={0.5}
                stroke="#444"
                strokeLinecap="round"
                style={{
                  strokeOpacity: 0.25,
                  stroke: '#000',
                  strokeWidth: 0.5,
                  strokeLinejoin: 'round',
                }}
              />
            )
          })
        })}
        {edges.map(({ source, destination, departed }) => {
          const [sx, sy] = coordinates(source)
          const [dx, dy] = coordinates(destination)
          const len = distance(sx, sy, dx, dy)
          return (
            <path
              key={`${departed}:${source}:${destination}`}
              d={`M ${sx} ${sy} L ${dx} ${dy}`}
              strokeWidth={0.5}
              stroke="#444"
              strokeLinecap="round"
              style={{
                strokeOpacity: 0.25,
                stroke: '#000',
                strokeWidth: 0.5,
                strokeDasharray: len,
                strokeLinejoin: 'round',
                strokeDashoffset: len,
                animation: `dash ${len}s linear`,
              }}
            />
          )
        })}
      </svg>
      <HeaderUser />
      {connecting && <Loading />}
      <StartButton />
      <button type="button" onClick={() => setDebug(!debug)}>
        Debug
      </button>
      {debug && (
        <>
          <pre>{state?.sols.map((sol) => JSON.stringify(sol)).join('\n')}</pre>
          <pre>
            {JSON.stringify(
              pipe(
                //
                dissoc('users'),
                dissoc('me'),
                dissoc('sols'),
                assoc('selected', selected)
              )(state!),
              undefined,
              2
            )}
          </pre>
        </>
      )}
    </>
  )
}

export default Game
