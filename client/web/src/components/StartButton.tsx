import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const StartButton = () => {
  const { move } = useHathoraContext()
  const [size, setSize] = useState<number>(50)
  return (
    <div>
      <input
        type="number"
        value={size}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10)
          if (!Number.isNaN(n) && n > 0 && n < 1000) setSize(n)
        }}
      />
      <button type="button" onClick={() => move(`START ${size}`)}>
        Start
      </button>
    </div>
  )
}
