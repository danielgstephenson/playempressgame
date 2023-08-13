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
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import isAgainstImprison from '../service/isAgainstImprison'
import isTaking from '../service/isTaking'
import isGameOver from '../service/isGameOver'
import getChoiceId from '../service/getChoiceId'
import losingAuction from '../asset/sound/losingAuction.mp3'
import tiedAuction from '../asset/sound/tiedAuction.mp3'
import imprison from '../asset/sound/imprison.mp3'
import youTake from '../asset/sound/youTake.mp3'
import choiceEffect from '../asset/sound/choiceEffect.mp3'
import gameLoss from '../asset/sound/gameLoss.mp3'
import gameVictory from '../asset/sound/gameVictory.mp3'
import gameTie from '../asset/sound/gameTie.mp3'
import getWinners from '../service/getWinners'

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
  useEffect(() => {
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
  const [bidClone, setBidClone] = useState(bid)
  const [tiedClone, setTiedClone] = useState(() => profiles != null && bid != null && isTied({ profiles, bid }))
  const [highestUntiedClone, setHighestUntiedClone] = useState(() => isHighestUntiedBidder({ profiles, userId }))
  const [againstImprisonClone, setAgainstImprisonClone] = useState(() => profiles != null && userId != null && isAgainstImprison({ profiles, userId }))
  const [takingClone, setTakingClone] = useState(() => isTaking({ profiles, userId, choices }))
  const [gameOverClone, setGameOverClone] = useState(() => profiles != null && final != null && choices != null && isGameOver({ profiles, final, choices }))
  const [hearLosingAuction] = useSound(losingAuction)
  const [hearAuctionTied] = useSound(tiedAuction, { volume: 0.5 })
  const [hearImprison] = useSound(imprison, { volume: 0.75 })
  const [hearYouTake] = useSound(youTake, { volume: 0.2 })
  const [hearChoiceEffect] = useSound(choiceEffect)
  const [hearGameLoss] = useSound(gameLoss)
  const [hearGameVictory] = useSound(gameVictory, { volume: 0.5 })
  const [hearGameTie] = useSound(gameTie)

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
    } else if (phase === 'auction') {
      const someUnready = profiles.some(profile => !profile.auctionReady)
      if (someUnready) {
        if (highestUntied !== highestUntiedClone) {
          if (tied) {
            hearAuctionTied()
          } else {
            hearLosingAuction()
          }
        } else if (tied !== tiedClone) {
          hearLosingAuction()
        }
      }
    }
  }
  if (profiles != null && userId != null && auctionReady != null) {
    const againstImprison = isAgainstImprison({ profiles, userId })
    if (againstImprison !== againstImprisonClone) {
      setAgainstImprisonClone(againstImprison)
      if (!auctionReady && phase === 'auction') {
        hearImprison()
      }
    }
  }
  if (profiles != null && userId != null && choices != null) {
    const taking = isTaking({ profiles, userId, choices })
    if (taking !== takingClone) {
      setTakingClone(taking)
      if (taking) {
        hearYouTake()
      }
    }
  }
  if (profiles != null && final != null && choices != null) {
    const gameOver = isGameOver({ profiles, final, choices })
    if (gameOver !== gameOverClone) {
      setGameOverClone(gameOver)
      if (gameOver) {
        const winners = getWinners({ profiles })
        const winner = winners.some(winner => winner.userId === userId)
        if (winner) {
          if (winners.length > 1) {
            hearGameTie()
          }
          hearGameVictory()
        } else {
          hearGameLoss()
        }
      }
    }
  }
  if (choices != null && userId != null && gameId != null) {
    const choiceId = getChoiceId({ choices, gameId, userId })
    if (choiceId !== choiceIdClone) {
      setChoiceIdClone(choiceId)
      if (choiceId != null) {
        hearChoiceEffect()
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
