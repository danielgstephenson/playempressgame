import PlayerHistoryView from './PlayerHistory'
import BidView from './Bid'
import { useContext, useEffect, useState } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import PlayPhaseView from './PlayPhase'
import functionsContext from '../context/functions'
import TakeView from './Take'
import ProfileView from './Profile'
import ProfileProvider from '../context/profile/Provider'
import useSound from 'use-sound'
import isTied from '../service/isTied'
import alert from '../alert.mp3'
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import isAgainstImprison from '../service/isAgainstImprison'
import isTaking from '../service/isTaking'
import isGameOver from '../service/isGameOver'
import getChoiceId from '../service/getChoiceId'

export default function PlayerView (): JSX.Element {
  const { court, dungeon, final, id: gameId, round, phase, profiles, choices } = useContext(gameContext)
  const {
    handlingIds,
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
  const { auctionReady, bid, deck, hand, tableau, userId, id: playerId } = useContext(playerContext)
  const [choiceIdClone, setChoiceIdClone] = useState(() => choices != null && userId != null && gameId != null && getChoiceId({ choices, gameId, userId }))
  console.log('choiceIdClone', choiceIdClone)
  useEffect(() => {
    console.log('reset choices')
    setTrashChoiceId?.(undefined)
    setDeckChoiceId?.(undefined)
    setTrashSchemeId?.(undefined)
    setPlaySchemeId?.(undefined)
    resetTaken?.()
  }, [resetTaken, round, setTrashSchemeId, setPlaySchemeId, setDeckChoiceId, setTrashChoiceId, choiceIdClone])
  useEffect(() => {
    if (deck == null) {
      return
    }
    setDeck?.(deck)
  }, [deck, setDeck])
  useEffect(() => {
    if (hand == null) {
      return
    }
    setHand?.(current => {
      if (hand == null || handlingIds == null || current == null) {
        return current
      }
      const handIds = hand.map(scheme => scheme.id)
      if (handIds.length === handlingIds.length && handIds?.every(id => handlingIds.includes(id))) {
        return current
      }
      const already = current?.filter(scheme => hand.some(handScheme => handScheme.id === scheme.id))

      const newSchemes = hand.filter(scheme => !current.some(currentScheme => currentScheme.id === scheme.id))
      const newHand = [...newSchemes, ...already]
      setHandClone?.(newHand)
      return newHand
    })
  }, [choices, hand, playerId, setHand, setHandClone, handlingIds])
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
  const [playAlert] = useSound(alert)
  const [phaseClone, setPhaseClone] = useState(phase)
  const [bidClone, setBidClone] = useState(bid)
  const [tiedClone, setTiedClone] = useState(() => profiles != null && bid != null && isTied({ profiles, bid }))
  const [highestUntiedClone, setHighestUntiedClone] = useState(() => isHighestUntiedBidder({ profiles, userId }))
  const [againstImprisonClone, setAgainstImprisonClone] = useState(() => profiles != null && userId != null && isAgainstImprison({ profiles, userId }))
  const [takingClone, setTakingClone] = useState(() => isTaking({ profiles, userId, choices }))
  const [gameOverClone, setGameOverClone] = useState(() => profiles != null && final != null && choices != null && isGameOver({ profiles, final, choices }))
  if (phase !== phaseClone) {
    setPhaseClone(phase)
    if (
      phaseClone != null &&
      phase != null &&
      phase !== 'join'
    ) {
      playAlert()
    }
  }
  if (profiles != null && bid != null) {
    const tied = isTied({ profiles, bid })
    if (tied !== tiedClone) {
      setTiedClone(tied)
    }
    const highestUntied = isHighestUntiedBidder({ profiles, userId })
    if (highestUntied !== highestUntiedClone) {
      setHighestUntiedClone(highestUntied)
    }
    if (bid !== bidClone) {
      setBidClone(bid)
    } else {
      if (highestUntied !== highestUntiedClone || tied !== tiedClone) {
        playAlert()
      }
    }
  }
  if (profiles != null && userId != null && auctionReady != null) {
    const againstImprison = isAgainstImprison({ profiles, userId })
    if (againstImprison !== againstImprisonClone) {
      setAgainstImprisonClone(againstImprison)
      if (!auctionReady) {
        playAlert()
      }
    }
  }
  if (profiles != null && userId != null && choices != null) {
    const taking = isTaking({ profiles, userId, choices })
    if (taking !== takingClone) {
      setTakingClone(taking)
      if (taking) {
        playAlert()
      }
    }
  }
  if (profiles != null && final != null && choices != null) {
    const gameOver = isGameOver({ profiles, final, choices })
    if (gameOver !== gameOverClone) {
      setGameOverClone(gameOver)
      if (gameOver) {
        playAlert()
      }
    }
  }
  if (choices != null && userId != null && gameId != null) {
    const choiceId = getChoiceId({ choices, gameId, userId })
    if (choiceId !== choiceIdClone) {
      setChoiceIdClone(choiceId)
      if (choiceId != null) {
        playAlert()
      }
    }
  }
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
