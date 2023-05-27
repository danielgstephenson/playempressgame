import { useContext, useEffect, useState } from 'react'
import playContext from '.'
import { playerContext } from '../../reader/player'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const playerState = useContext(playerContext)
  const [trashScheme, setTrashScheme] = useState<Scheme>()
  const [playScheme, setPlayScheme] = useState<Scheme>()
  useEffect(() => {
    setTrashScheme(playerState.trashScheme)
    setPlayScheme(playerState.playScheme)
  }, [playerState.trashScheme, playerState.playScheme])
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
