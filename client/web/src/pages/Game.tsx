import { useParams } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { append, assoc, dissoc, equals, forEach, pipe, reject } from 'ramda'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'
import { StartButton } from '../components/StartButton'

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state, move } = useHathoraContext()
  const [selected, setSelected] = useState<number[]>([])
  useAutoConnect(gameId)

  const nodes = state?.sols ?? []

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
        style={{ width: '100%', height: '40em' }}
        role="img"
      >
        <title>A gradient</title>
        {nodes.map((sol, n) => {
          const baseAngle = Math.PI * (1 + Math.sqrt(5))
          const r = Math.sqrt(n + 0.5) * 4
          const theta = n * baseAngle
          const x = r * Math.cos(theta)
          const y = r * Math.sin(theta)
          const fill = sol.owner === undefined ? '#ddd' : state?.users?.[sol.owner].color

          return (
            <circle
              onClick={handleLeftClick(n)}
              onContextMenu={handleRightClick(n)}
              // eslint-disable-next-line react/no-array-index-key
              key={`dot${n}`}
              cx={`${x}`}
              cy={`${y}`}
              r="3"
              style={{
                fill,
                ...(selected.includes(n)
                  ? {
                      stroke: '#000000',
                      strokeWidth: 1,
                      strokeDasharray: '2,2',
                      strokeLinejoin: 'round',
                    }
                  : {}),
              }}
            />
          )
        })}
      </svg>
      <HeaderUser />
      {connecting && <Loading />}
      <StartButton />
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
  )
}

export default Game
