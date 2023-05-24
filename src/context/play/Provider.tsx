import { useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashScheme, setTrashScheme] = useState<Scheme>()
  const [playScheme, setPlayScheme] = useState<Scheme>()
  function trash (scheme: Scheme): void {
    setTrashScheme(scheme)
  }
  function play (scheme: Scheme): void {
    setPlayScheme(scheme)
  }
  function emptyTrash (): void {
    setTrashScheme(undefined)
  }
  function emptyPlay (): void {
    setPlayScheme(undefined)
  }
  const state = {
    trashScheme,
    playScheme,
    trash,
    play,
    emptyTrash,
    emptyPlay
  }
  return (
    <playContext.Provider value={state}>
      {children}
    </playContext.Provider>
  )
}
