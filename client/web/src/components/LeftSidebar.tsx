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

const ENABLE_DEBUG = false

export const LeftSidebar = ({ selected }: Props) => {
  const { connecting, state } = useHathoraContext()
  const [debug, setDebug] = useState<boolean>(false)
  return (
    <div className={classes.sidebar}>
      <div>
        <h1>Dark Forest</h1>
        <HeaderUser />
        {connecting && <Loading />}
        {state?.me && (
          <>
            <hr />
            Select a universe size to start the game. Recommended sizes are:
            <ul>
              <li>10 - Fast game</li>
              <li>30 - Medium game</li>
              <li>90 - Long game</li>
              <li>200 - Marathon</li>
            </ul>
            <StartButton />
          </>
        )}
        {ENABLE_DEBUG && (
          <>
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
                      dissoc('sols'),
                      assoc('selected', selected)
                    )(state!),
                    undefined,
                    2
                  )}
                </pre>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
