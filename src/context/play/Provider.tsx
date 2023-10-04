import { useCallback, useMemo, useState } from 'react'
import playContext from '.'
import { Play, Scheme } from '../../types'

export default function PlayProvider ({ children }: {
  children: React.ReactNode
}): JSX.Element {
  const [court, setCourt] = useState<Scheme[]>([])
  const [reserve, setReserve] = useState<Scheme[]>([])
  const [reserveChoiceId, setReserveChoiceId] = useState<string>()
  const [dungeon, setDungeon] = useState<Scheme[]>([])
  const [hand, setHand] = useState<Scheme[]>([])
  const [handClone, setHandClone] = useState<Scheme[]>([])
  const [overCourt, setOverCourt] = useState(false)
  const [overReserve, setOverReserve] = useState(false)
  const [overDungeon, setOverDungeon] = useState(false)
  const [overPlay, setOverPlay] = useState(false)
  const [overInPlay, setOverInPlay] = useState(false)
  const [overTrash, setOverTrash] = useState(false)
  const [playSchemeId, setPlaySchemeId] = useState<string>()
  const [trashChoiceId, setTrashChoiceId] = useState<string>()
  const [trashSchemeId, setTrashSchemeId] = useState<string>()
  const [inPlay, setInPlay] = useState<Scheme[]>([])
  const [taken, setTaken] = useState<string[]>([])
  const handlingIds = useMemo(() => {
    const handlingIds = hand.map(scheme => scheme.id)
    const areaIds = [reserveChoiceId, trashChoiceId, playSchemeId, trashSchemeId]
    areaIds.forEach(id => id != null && handlingIds.push(id))
    return handlingIds
  }, [reserveChoiceId, hand, playSchemeId, trashChoiceId, trashSchemeId])
  const leave = useCallback((schemeId: string) => {
    setTaken(taken => taken.filter(scheme => scheme !== schemeId))
  }, [])
  const resetTaken = useCallback(() => setTaken([]), [])
  const take = useCallback((schemeId: string) => {
    setTaken(taken => [...taken, schemeId])
  }, [])
  const emptyTrash = useCallback(() => setTrashSchemeId(undefined), [])
  const emptyPlay = useCallback(() => setPlaySchemeId(undefined), [])

  const state: Play = {
    court,
    reserve,
    reserveChoiceId,
    dungeon,
    emptyPlay,
    emptyTrash,
    hand,
    handClone,
    handlingIds,
    leave,
    overCourt,
    overReserve,
    overDungeon,
    overPlay,
    overInPlay,
    overTrash,
    playSchemeId,
    resetTaken,
    setCourt,
    setReserve,
    setReserveChoiceId: setReserveChoiceId,
    setDungeon,
    setHand,
    setHandClone,
    setOverCourt,
    setOverReserve: setOverReserve,
    setOverDungeon,
    setOverPlay,
    setOverInPlay,
    setOverTrash,
    setPlaySchemeId,
    setInPlay,
    setTrashChoiceId,
    setTrashSchemeId,
    inPlay,
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
