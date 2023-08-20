import { GoogleLogin } from '@react-oauth/google'
import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { state: { users, me } = { users: [] }, connecting, join } = useHathoraContext()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!users?.length ? (
        <p>The universe is quiet. As far as you know, you are alone.</p>
      ) : (
        <p>The night sky is a cacophany messages from these civilizations:</p>
      )}
      {users.map((u) => (
        <div
          key={u.id}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={u.picture}
            height="32"
            width="32"
            alt={u.name}
            style={{
              borderColor: u.color,
              borderRadius: 32,
              borderWidth: 4,
              borderStyle: 'solid',
            }}
          />
          <div style={{ paddingLeft: 5, paddingRight: 10 }}>{u.name}</div>
        </div>
      ))}
      {me === undefined && !connecting && (
        <div>
          <hr />
          <div>
            <p>No one else in the universe knows you exist, maybe you should keep it that way?</p>
            <button
              type="button"
              style={{
                minHeight: 32,
                minWidth: 200,
                backgroundColor: '#0d88ed',
                color: 'white',
                borderRadius: 32,
                borderWidth: 0,
              }}
              onClick={join}
            >
              Broadcast existance
            </button>
          </div>
          <hr />
        </div>
      )}
    </div>
  )
}
