import { useCallback, useMemo, useState } from 'react'
import playContext from '.'
import { Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [court, setCourt] = useState<Scheme[]>([])
  const [deck, setDeck] = useState<Scheme[]>([])
  const [deckChoiceId, setDeckChoiceId] = useState<string>()
  const [dungeon, setDungeon] = useState<Scheme[]>([])
  const [hand, setHand] = useState<Scheme[]>([])
  const [handClone, setHandClone] = useState<Scheme[]>([])
  const [overCourt, setOverCourt] = useState(false)
  const [overDeck, setOverDeck] = useState(false)
  const [overDungeon, setOverDungeon] = useState(false)
  const [overPlay, setOverPlay] = useState(false)
  const [overTableau, setOverTableau] = useState(false)
  const [overTrash, setOverTrash] = useState(false)
  const [playSchemeId, setPlaySchemeId] = useState<string>()
  const [trashChoiceId, setTrashChoiceId] = useState<string>()
  const [trashSchemeId, setTrashSchemeId] = useState<string>()
  const [tableau, setTableau] = useState<Scheme[]>([])
  const [taken, setTaken] = useState<string[]>([])
  const handlingIds = useMemo(() => {
    const handlingIds = hand.map(scheme => scheme.id)
    const areaIds = [deckChoiceId, trashChoiceId, playSchemeId, trashSchemeId]
    areaIds.forEach(id => id != null && handlingIds.push(id))
    return handlingIds
  }, [deckChoiceId, hand, playSchemeId, trashChoiceId, trashSchemeId])
  const leave = useCallback((schemeId: string) => {
    setTaken(taken => taken.filter(scheme => scheme !== schemeId))
  }, [])
  const resetTaken = useCallback(() => setTaken([]), [])
  const take = useCallback((schemeId: string) => {
    setTaken(taken => [...taken, schemeId])
  }, [])
  const emptyTrash = useCallback(() => setTrashSchemeId(undefined), [])
  const emptyPlay = useCallback(() => setPlaySchemeId(undefined), [])

  const state = {
    court,
    deck,
    deckChoiceId,
    dungeon,
    emptyPlay,
    emptyTrash,
    hand,
    handClone,
    handlingIds,
    leave,
    overCourt,
    overDeck,
    overDungeon,
    overPlay,
    overTableau,
    overTrash,
    playSchemeId,
    resetTaken,
    setCourt,
    setDeck,
    setDeckChoiceId,
    setDungeon,
    setHand,
    setHandClone,
    setOverCourt,
    setOverDeck,
    setOverDungeon,
    setOverPlay,
    setOverTableau,
    setOverTrash,
    setPlaySchemeId,
    setTableau,
    setTrashChoiceId,
    setTrashSchemeId,
    tableau,
    take,
    taken,
    trashChoiceId,
    trashSchemeId
  }
  return (
    <playContext.Provider value={state}>
      {children}
    </playContext.Provider>
  )
}
