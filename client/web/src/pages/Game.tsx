import { useParams } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { append, equals, forEach, last, reduce, reject } from 'ramda'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'
import { EngineSol } from '../../../../api/types'
import { LeftSidebar } from '../components/LeftSidebar'
import { RightSidebar } from '../components/RightSidebar'

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
  const { state, move } = useHathoraContext()
  const [selected, setSelected] = useState<number[]>([])
  const [hovered, setHovered] = useState<number | undefined>(undefined)
  useAutoConnect(gameId)

  const nodes = state?.sols ?? []
  const edges = state?.transits ?? []

  const handleLeftClick = (n: number) => (e: MouseEvent) => {
    e.preventDefault()
    if (e.shiftKey) return move(`SPAWN ${n}`)
    if (selected.includes(n)) {
      setSelected(reject(equals(n), selected))
    } else if (state?.sols?.[n]?.owner !== undefined) {
      setSelected(append(n, selected))
    }
    return undefined
  }

  const handleRightClick = (dst: number) => (e: MouseEvent) => {
    e.preventDefault()
    forEach((src) => move(`TRANSIT ${src} ${dst}`), selected)
    setSelected([])
    return undefined
  }

  const handleHover = (n: number) => (e: MouseEvent) => {
    setHovered(n)
  }

  const SCALE = (0.107 * nodes.length) ** 0.458 / 3

  return (
    <div style={{ display: 'flex', padding: 0, margin: 0 }}>
      <LeftSidebar selected={selected} />
      <svg
        viewBox={`${-50 * SCALE} ${-50 * SCALE} ${100 * SCALE} ${100 * SCALE}`} /* min-x min-y width height */
        preserveAspectRatio="xMaxYMid meet"
        style={{
          width: '100vh',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
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
            sol.owner !== undefined && sol.path.length === 0 ? 1 : 0,
            nodes
          )
          return (
            <circle
              onClick={handleLeftClick(n)}
              onContextMenu={handleRightClick(n)}
              onMouseOver={handleHover(n)}
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
                animation: `dash ${len}s ease-in-out`, // cubic-bezier(0.2,0,0.8,1)
              }}
            />
          )
        })}
      </svg>
      <RightSidebar hovered={hovered} />
    </div>
  )
}

export default Game
