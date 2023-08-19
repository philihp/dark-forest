import { useState } from 'react'
import { assoc, dissoc, pipe } from 'ramda'
import classes from './Sidebar.module.css'
import { HeaderUser } from './HeaderUser'
import { Loading } from './Loading'
import { StartButton } from './StartButton'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  selected: number[]
}

export const LeftSidebar = ({ selected }: Props) => {
  const { connecting, state } = useHathoraContext()
  const [debug, setDebug] = useState<boolean>(false)
  return (
    <div className={classes.sidebar}>
      <div>
        <HeaderUser />
        {connecting && <Loading />}
        <StartButton />
        <button type="button" onClick={() => setDebug(!debug)}>
          Debug
        </button>
        {debug && (
          <>
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
        )}
      </div>
    </div>
  )
}
