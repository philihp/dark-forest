import { useParams } from 'react-router-dom'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'

import { useHathoraContext } from '../context/GameContext'
import { useAutoConnect } from '../hooks/useAutoConnect'

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state } = useHathoraContext()
  useAutoConnect(gameId)

  return (
    <>
      <HeaderUser />
      {connecting && <Loading />}
      <pre>{JSON.stringify(state, undefined, 2)}</pre>
    </>
  )
}

export default Game
