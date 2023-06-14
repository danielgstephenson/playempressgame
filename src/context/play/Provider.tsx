import { useCallback, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashScheme, setTrashScheme] = useState<Scheme>()
  const [playScheme, setPlayScheme] = useState<Scheme>()
  const [taken, setTaken] = useState<string[]>([])
  const [deck, setDeck] = useState<Scheme[]>([])
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
  const reorder = useCallback((deck: Scheme[]) => {
    setDeck(deck)
  }, [])
  const state = {
    deck,
    emptyPlay,
    emptyTrash,
    leave,
    play,
    playScheme,
    reorder,
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
