import DeckView from './Deck'
import DiscardView from './Discard'
import PlayerHistoryView from './PlayerHistory'
import BidView from './Bid'
import { useContext, useEffect } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import PlayPhaseView from './PlayPhase'

export default function PlayerView (): JSX.Element {
  const { round, phase } = useContext(gameContext)
  const { resetTaken, setDeck, setHand, setHandClone, setPlaySchemeId, setTrashSchemeId } = useContext(playContext)
  const { deck, hand } = useContext(playerContext)
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
    if (hand == null) {
      return
    }

    setHand?.(current => {
      const already = current?.filter(scheme => hand.some(handScheme => handScheme.id === scheme.id))

      const newSchemes = hand.filter(scheme => !current.some(currentScheme => currentScheme.id === scheme.id))
      const newHand = [...newSchemes, ...already]
      setHandClone?.(newHand)
      return newHand
    })
  }, [hand, setHand, setHandClone])
  useEffect(() => {
    if (phase !== 'play') {
      setPlaySchemeId?.(undefined)
      setTrashSchemeId?.(undefined)
    }
  }, [setPlaySchemeId, setTrashSchemeId, phase])

  return (
    <>
      <BidView />
      <PlayPhaseView />
      <DeckView />
      <DiscardView />
      <PlayerHistoryView />
    </>
  )
}
