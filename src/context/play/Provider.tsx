import { useCallback, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [court, setCourt] = useState<Scheme[]>([])
  const [deck, setDeck] = useState<Scheme[]>([])
  const [dungeon, setDungeon] = useState<Scheme[]>([])
  const [hand, setHand] = useState<Scheme[]>([])
  const [handClone, setHandClone] = useState<Scheme[]>([])
  const [overPlay, setOverPlay] = useState(false)
  const [overTrash, setOverTrash] = useState(false)
  const [playSchemeId, setPlaySchemeId] = useState<string>()
  const [trashSchemeId, setTrashSchemeId] = useState<string>()
  const [tableau, setTableau] = useState<Scheme[]>([])
  const [taken, setTaken] = useState<string[]>([])
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
    court,
    deck,
    dungeon,
    emptyPlay,
    emptyTrash,
    hand,
    handClone,
    leave,
    overPlay,
    overTrash,
    playSchemeId,
    resetTaken,
    setCourt,
    setDeck,
    setDungeon,
    setHand,
    setHandClone,
    setOverPlay,
    setOverTrash,
    setPlaySchemeId,
    setTableau,
    setTrashSchemeId,
    tableau,
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
