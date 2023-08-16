import { GoogleLogin } from '@react-oauth/google'
import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { user, state, login } = useHathoraContext()

  return (
    <div
      style={{
        position: 'sticky',
        backgroundColor: state?.control ? '#fdb462' : 'auto',
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
      {/* {user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={user.picture}
            height="32"
            width="32"
            alt={user.name}
            style={{ ...colorToStyle(state?.me?.color), borderRadius: 16, borderWidth: 4, borderStyle: 'solid' }}
          />
        </div>
      )} */}
    </div>
  )
}
