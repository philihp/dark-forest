import { useState } from 'react'
import { assoc, dissoc, intersperse, pipe } from 'ramda'
import { useParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
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
  const { gameId } = useParams()
  const { connecting, state, login, user } = useHathoraContext()
  const [debug, setDebug] = useState<boolean>(false)
  return (
    <div className={classes.sidebar}>
      <div>
        {intersperse(<hr />, [
          <>
            <h1>Dark Forest</h1>
            {!user && (
              <GoogleLogin
                auto_select
                onSuccess={login}
                onError={() => {
                  console.log('Login Failed')
                }}
              />
            )}
            <p>
              Share this URL with players to join: <a href={`/game/${gameId}`}>dark.kennerspiel.com/game/{gameId}</a>
            </p>
          </>,
          <HeaderUser />,
          ...(connecting ? [<Loading />] : []),
          ...(state?.me?.index === undefined
            ? []
            : [
                !state?.sols?.length ? (
                  <>
                    <p>
                      Your young civilization looks up for the first time. Cracks in the firmament show other stars,
                      worlds ready for colonization. How many stars do you see?
                    </p>
                    <ul>
                      <li>10 - Quick</li>
                      <li>30 - Interesting</li>
                      <li>90 - Grueling</li>
                      <li>200 - Marathon</li>
                    </ul>
                    <StartButton />
                  </>
                ) : (
                  <div>
                    <p>Your radio telescopes receive a message:</p>
                    <p>
                      <i>
                        This system has received your message. I am a pacifist of this system. It is the luck of your
                        civilization that I am the first to receive your message. As long as you do not answer, this
                        system will not be able to triangulate the source of your transmission. But if you do answer,
                        the source will be located and your planet will be invaded.
                      </i>
                    </p>
                    <hr />
                    <h3>Controls</h3>
                    <p>
                      Shift-left click: <b>Answer</b> the message and announce your location. You can only do this if
                      you control no systems, and only on an unconquered system.
                    </p>
                    <p>
                      Left click: <b>Select</b> a system to move somewhere. You can select multiple systems.
                    </p>
                    <p>
                      Right click: <b>Move</b> fleets from selected systems to here. When it arrives, if it has higher
                      strength than the system, you will conquer it.
                    </p>
                  </div>
                ),
              ]),
          ...(!ENABLE_DEBUG
            ? []
            : [
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
                </>,
              ]),
        ])}
      </div>
    </div>
  )
}
