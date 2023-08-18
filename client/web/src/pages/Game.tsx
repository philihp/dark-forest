import { useParams } from 'react-router-dom'
import { MouseEvent } from 'react'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state, move } = useHathoraContext()
  useAutoConnect(gameId)

  const nodes = state?.sols ?? []

  const handleClick = (n: number) => (e: MouseEvent) => {
    console.log(e.shiftKey, e)
    if (e.shiftKey) return move(`SPAWN ${n}`)
    return move(`TRANSIT ${n} ${0}`)
  }

  return (
    <>
      <svg
        viewBox="-100 -100 200 200" /* min-x min-y width height */
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '40em' }}
        role="img"
      >
        <title>A gradient</title>
        {nodes.map((sol, n) => {
          const baseAngle = Math.PI * (1 + Math.sqrt(5))
          const r = Math.sqrt(n + 0.5) * 7
          const theta = n * baseAngle
          const x = r * Math.cos(theta)
          const y = r * Math.sin(theta)

          return (
            <circle
              onClick={handleClick(n)}
              // eslint-disable-next-line react/no-array-index-key
              key={`dot${n}`}
              cx={`${x}`}
              cy={`${y}`}
              r="5"
              style={{ fill: '#87a74f' }}
            />
          )
        })}
      </svg>
      <HeaderUser />
      {connecting && <Loading />}
      <pre>{JSON.stringify(state, undefined, 2)}</pre>
    </>
  )
}

export default Game
