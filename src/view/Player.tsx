import PlayerHistoryView from './PlayerHistory'
import BidView from './Bid'
import { useContext, useEffect } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import PlayPhaseView from './PlayPhase'
import functionsContext from '../context/functions'
import TakeView from './Take'
import ProfileView from './Profile'
import ProfileProvider from '../context/profile/Provider'

export default function PlayerView (): JSX.Element {
  const { court, dungeon, round, phase, profiles, choices } = useContext(gameContext)
  const {
    resetTaken,
    setCourt,
    setDeck,
    setDeckChoiceId,
    setDungeon,
    setHand,
    setHandClone,
    setPlaySchemeId,
    setTableau,
    setTrashChoiceId,
    setTrashSchemeId
  } = useContext(playContext)
  const { deck, hand, tableau, userId, id: playerId } = useContext(playerContext)
  useEffect(() => {
    setTrashSchemeId?.(undefined)
    setPlaySchemeId?.(undefined)
    resetTaken?.()
  }, [resetTaken, round, setTrashSchemeId, setPlaySchemeId])
  useEffect(() => {
    if (deck == null) {
      return
    }
    setDeck?.(deck)
  }, [deck, setDeck])
  useEffect(() => {
    console.log('hand', hand)
    if (hand == null) {
      return
    }
    setHand?.(current => {
      const currentIds = current?.map(scheme => scheme.id)
      console.log('currentIds', currentIds)
      const handIds = hand?.map(scheme => scheme.id)
      console.log('handIds', handIds)
      if (handIds.length === currentIds.length && handIds?.every(id => currentIds?.includes(id))) {
        return current
      }
      const already = current?.filter(scheme => hand.some(handScheme => handScheme.id === scheme.id))

      const newSchemes = hand.filter(scheme => !current.some(currentScheme => currentScheme.id === scheme.id))
      const newHand = [...newSchemes, ...already]
      setHandClone?.(newHand)
      return newHand
    })
  }, [choices, hand, playerId, setHand, setHandClone])
  useEffect(() => {
    if (court == null) {
      return
    }
    setCourt?.(court)
  }, [court, setCourt])
  useEffect(() => {
    if (dungeon == null) {
      return
    }
    setDungeon?.(dungeon)
  }, [dungeon, setDungeon])
  useEffect(() => {
    if (tableau == null) {
      return
    }
    setTableau?.(tableau)
  }, [setTableau, tableau])
  useEffect(() => {
    if (phase !== 'play') {
      setPlaySchemeId?.(undefined)
      setTrashSchemeId?.(undefined)
      setTrashChoiceId?.(undefined)
      setDeckChoiceId?.(undefined)
    }
  }, [setPlaySchemeId, setTrashSchemeId, setDeckChoiceId, setTrashChoiceId, phase])
  const functionsState = useContext(functionsContext)
  if (functionsState.functions == null || profiles == null) return <></>
  const otherProfiles = profiles.filter(profile => profile.userId !== userId)
  const otherProfileViews = otherProfiles.map(profile => {
    return (
      <ProfileProvider key={profile.userId} profile={profile}>
        <ProfileView />
      </ProfileProvider>
    )
  })
  return (
    <>
      <TakeView functions={functionsState.functions} />
      {otherProfileViews}
      <BidView />
      <PlayPhaseView />
      <PlayerHistoryView />
    </>
  )
}
