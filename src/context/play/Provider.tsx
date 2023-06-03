import { useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashScheme, setTrashScheme] = useState<Scheme>()
  const [playScheme, setPlayScheme] = useState<Scheme>()
  const [taken, setTaken] = useState<string[]>([])
  function leave (schemeId: string): void {
    setTaken(taken.filter(scheme => scheme !== schemeId))
  }
  function take (schemeId: string): void {
    setTaken([...taken, schemeId])
  }
  function trash (scheme: Scheme | undefined): void {
    setTrashScheme(scheme)
  }
  function play (scheme: Scheme | undefined): void {
    setPlayScheme(scheme)
  }
  function emptyTrash (): void {
    setTrashScheme(undefined)
  }
  function emptyPlay (): void {
    setPlayScheme(undefined)
  }
  const state = {
    emptyPlay,
    emptyTrash,
    leave,
    play,
    playScheme,
    take,
    taken,
    trash,
    trashScheme
  }
  return (
    <playContext.Provider value={state}>
      {children}
    </playContext.Provider>
  )
}
