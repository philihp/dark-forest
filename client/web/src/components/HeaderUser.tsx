import { GoogleLogin } from '@react-oauth/google'
import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { state: { users } = { users: [] }, user, state, login, join } = useHathoraContext()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
            borderColor: u.color,
            borderRadius: 32,
            borderWidth: 4,
            borderStyle: 'solid',
          }}
        >
          <img
            src={u.picture}
            height="32"
            width="32"
            alt={u.name}
            style={{
              borderRadius: 32,
            }}
          />
          <div style={{ paddingLeft: 5, paddingRight: 10 }}>{u.name}</div>
        </div>
      ))}
      <div>
        <div
          style={{
            display: 'flex',
            borderColor: '#eee',
            borderRadius: 32,
            borderWidth: 4,
            borderStyle: 'solid',
          }}
        >
          <button
            type="button"
            style={{ minHeight: 32, backgroundColor: '#ccc', borderRadius: 32, borderWidth: 0 }}
            onClick={join}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}
