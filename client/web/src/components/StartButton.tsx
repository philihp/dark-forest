import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const StartButton = () => {
  const { move } = useHathoraContext()
  const [size, setSize] = useState('50')
  return (
    <div>
      <input type="number" onChange={(e) => setSize(e.target.value)} />
      <button type="button" onClick={() => move(`START ${size}`)}>
        Start
      </button>
    </div>
  )
}
