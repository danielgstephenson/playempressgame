import { useCallback, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashScheme, setTrashScheme] = useState<Scheme>()
  const [playScheme, setPlayScheme] = useState<Scheme>()
  const [taken, setTaken] = useState<string[]>([])
  const leave = useCallback((schemeId: string) => {
    setTaken(taken => taken.filter(scheme => scheme !== schemeId))
  }, [])
  const take = useCallback((schemeId: string) => {
    setTaken(taken => [...taken, schemeId])
  }, [])
  const trash = useCallback((scheme: Scheme | undefined) => {
    setTrashScheme(scheme)
  }, [])
  const play = useCallback((scheme: Scheme | undefined) => {
    setPlayScheme(scheme)
  }, [])
  const emptyTrash = useCallback(() => {
    setTrashScheme(undefined)
  }, [])
  const emptyPlay = useCallback(() => {
    setPlayScheme(undefined)
  }, [])
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
