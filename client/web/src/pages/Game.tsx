import { useParams } from 'react-router-dom'
import { range } from 'ramda'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state } = useHathoraContext()
  useAutoConnect(gameId)

  const nodes = range(0, 100)

  return (
    <>
      <HeaderUser />
      {connecting && <Loading />}
      <svg
        viewBox="-100 -100 200 200" /* min-x min-y width height */
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '40em' }}
        role="img"
      >
        <title>A gradient</title>
        {nodes.map((n) => {
          const baseAngle = Math.PI * (1 + Math.sqrt(5))
          const r = Math.sqrt(n + 0.5) * 7
          const theta = n * baseAngle
          const x = r * Math.cos(theta)
          const y = r * Math.sin(theta)

          return <circle key={`dot${n}`} cx={`${x}`} cy={`${y}`} r="2" style={{ fill: '#87a74f' }} />
        })}
      </svg>
      <pre>{JSON.stringify(state, undefined, 2)}</pre>
    </>
  )
}

export default Game
