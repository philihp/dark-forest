import { GoogleLogin } from '@react-oauth/google'
import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { state: { users } = { users: [] }, user, state, login, join } = useHathoraContext()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!user && (
        <GoogleLogin
          auto_select
          onSuccess={login}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      )}
      {/* <div style={{ display: 'flex' }}>{JSON.stringify({ user })}</div> */}
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
      <div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <button
            type="button"
            style={{
              minHeight: 32,
              minWidth: 100,
              backgroundColor: '#ccc',
              borderRadius: 32,
              borderWidth: 0,
            }}
            onClick={join}
          >
            Join
          </button>
        </div>
        <hr />
      </div>
    </div>
  )
}
