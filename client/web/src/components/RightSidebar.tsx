import { count } from 'ramda'
import { useHathoraContext } from '../context/GameContext'
import classes from './Sidebar.module.css'
import { EngineSol } from '../../../../api/types'

const strength =
  (sol: number) =>
  (sols: EngineSol[]): number =>
    count((thisSol: EngineSol): boolean => thisSol.path[thisSol.path.length - 1] === sol, sols) +
    (sols?.[sol].owner !== undefined && sols?.[sol]?.path?.length === 0 ? 1 : 0)

interface Props {
  hovered: number | undefined
}

const SelectedSol = ({ n }: { n: number }) => {
  const { state } = useHathoraContext()

  const owner = state?.users?.[state?.sols?.[n]?.owner ?? -1]
  const str = state?.me !== undefined ? strength(n)(state?.sols ?? []) : '???'
  return (
    <div>
      <h3>System #{n}</h3>
      {owner && (
        <img
          src={owner.picture}
          alt={owner.name}
          style={{
            borderStyle: 'solid',
            borderRadius: 32,
            borderWidth: 8,
            borderColor: owner.color,
            height: 64,
          }}
        />
      )}
      <h4>
        Fleet strength: <span style={{ fontSize: 30 }}>{str}</span>
      </h4>
      <p>
        Every system has a fleet strength of 1, but it may send its fleet strength to another fleet. In order to conquer
        a system, a fleet must be sent with an overpowering strength; the defender wins on ties. Multiple stystems can
        form a supply line, however losing any system along the route will immediately disrupt this strength.
      </p>
    </div>
  )
}

export const RightSidebar = ({ hovered }: Props) => {
  return <div className={classes.sidebar}>{hovered !== undefined && <SelectedSol n={hovered} />}</div>
}
