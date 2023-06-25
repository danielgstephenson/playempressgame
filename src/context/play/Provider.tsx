import { useCallback, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashSchemeId, setTrashSchemeId] = useState<string>()
  const [playSchemeId, setPlaySchemeId] = useState<string>()
  const [taken, setTaken] = useState<string[]>([])
  const [hand, setHand] = useState<Scheme[]>([])
  const [deck, setDeck] = useState<Scheme[]>([])
  const leave = useCallback((schemeId: string) => {
    setTaken(taken => taken.filter(scheme => scheme !== schemeId))
  }, [])
  const resetTaken = useCallback(() => {
    setTaken([])
  }, [])
  const take = useCallback((schemeId: string) => {
    setTaken(taken => [...taken, schemeId])
  }, [])
  const emptyTrash = useCallback(() => {
    setTrashSchemeId(undefined)
  }, [])
  const emptyPlay = useCallback(() => {
    setPlaySchemeId(undefined)
  }, [])
  const removeFromTrash = useCallback((schemeId: string | undefined) => {
    setTrashSchemeId(current => schemeId === current ? undefined : current)
  }, [])
  const removeFromPlay = useCallback((schemeId: string | undefined) => {
    setPlaySchemeId(current => schemeId === current ? undefined : current)
  }, [])
  const trash = useCallback((schemeId: string | undefined) => {
    setTrashSchemeId(schemeId)
    removeFromPlay(schemeId)
  }, [removeFromPlay])
  const play = useCallback((schemeId: string | undefined) => {
    console.log('play', schemeId)
    setPlaySchemeId(schemeId)
    removeFromTrash(schemeId)
  }, [removeFromTrash])
  const state = {
    deck,
    emptyPlay,
    emptyTrash,
    hand,
    leave,
    play,
    playSchemeId,
    removeFromPlay,
    removeFromTrash,
    resetTaken,
    setDeck,
    setHand,
    take,
    taken,
    trash,
    trashSchemeId
  }
  return (
    <playContext.Provider value={state}>
      {children}
    </playContext.Provider>
  )
}
