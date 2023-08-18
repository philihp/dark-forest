import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useHathoraContext } from '../context/GameContext'
import { HeaderUser } from '../components/HeaderUser'
import { HathoraClient } from '../../../.hathora/client'

const Home = () => {
  const navigate = useNavigate()
  const { createPrivateLobby, createPublicLobby, getPublicLobbies, user, login } = useHathoraContext()

  const [lobbies, setLobbies] = useState<Awaited<ReturnType<HathoraClient['getPublicLobbies']>>>([])
  useEffect(() => {
    getPublicLobbies().then((lobbyInfo) => {
      setLobbies(lobbyInfo)
    })
  }, [setLobbies, getPublicLobbies])

  return (
    <>
      {!user && (
        <GoogleLogin
          auto_select
          onSuccess={login}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      )}
      <h1>Dark Forest</h1>
      <h3>Public Servers</h3>
      <table border={1} cellPadding={3} cellSpacing={0}>
        <thead>
          <tr>
            <th>Room Code</th>
            <th>Region</th>
            <th colSpan={3}>Details</th>
          </tr>
        </thead>
        <tbody>
          {lobbies &&
            lobbies.map((lobby) => {
              const { roomId } = lobby
              const { region } = lobby
              const state = (lobby as unknown as { state: { players?: number; country?: string } })?.state
              return (
                <tr>
                  <td>{roomId}</td>
                  <td>{region}</td>
                  <td>
                    {state?.players} players
                    <br />
                    {state?.country}
                  </td>
                  <td>{!state?.players && !state?.country && JSON.stringify({ state })}</td>
                  <td>
                    <button
                      type="button"
                      onClick={async () => {
                        navigate(`/game/${roomId}`)
                      }}
                    >
                      Join
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <button
        disabled={!user}
        type="button"
        onClick={async () => {
          const roomId = await createPublicLobby()
          navigate(`/game/${roomId}`)
        }}
      >
        Create Public Server
      </button>
      <h3>Private Servers</h3>
      <button
        disabled={!user}
        type="button"
        onClick={async () => {
          const roomId = await createPrivateLobby()
          navigate(`/game/${roomId}`)
        }}
      >
        Create Private Lobby
      </button>
      <hr />
      Dark Forest, made with ♥ in San Francisco.
    </>
  )
}

export default Home
