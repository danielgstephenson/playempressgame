import { useCallback, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [trashSchemeId, setTrashSchemeId] = useState<string>()
  const [playSchemeId, setPlaySchemeId] = useState<string>()
  const [taken, setTaken] = useState<string[]>([])
  const [handClone, setHandClone] = useState<Scheme[]>([])
  const [hand, setHand] = useState<Scheme[]>([])
  const [deck, setDeck] = useState<Scheme[]>([])
  const [overPlay, setOverPlay] = useState(false)
  const [overTrash, setOverTrash] = useState(false)
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
  const state = {
    deck,
    emptyPlay,
    emptyTrash,
    hand,
    handClone,
    leave,
    overPlay,
    overTrash,
    playSchemeId,
    resetTaken,
    setDeck,
    setHand,
    setHandClone,
    setOverPlay,
    setOverTrash,
    setPlaySchemeId,
    setTrashSchemeId,
    take,
    taken,
    trashSchemeId
  }
  return (
    <playContext.Provider value={state}>
      {children}
    </playContext.Provider>
  )
}
