import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashAreaView from './TrashArea'
import PlayAreaView from './PlayArea'
import PlayReadyView from './PlayReady'
import PlayerHistoryView from './PlayerHistory'
import ChoiceView from './Choice'
import PrivateTrashView from './PrivateTrash'
import BidView from './Bid'
import { useContext, useEffect } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'

export default function PlayerView (): JSX.Element {
  const { round } = useContext(gameContext)
  const { resetTaken, setDeck, setHand, trash, play } = useContext(playContext)
  const { deck, hand } = useContext(playerContext)
  useEffect(() => {
    trash?.(undefined)
    play?.(undefined)
    resetTaken?.()
  }, [resetTaken, round, trash, play])
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
      return [...newSchemes, ...already]
    })
  }, [hand, setHand])

  return (
    <>
      <PlayerHistoryView />
      <BidView />
      <PlayReadyView />
      <PlayAreaView />
      <TrashAreaView />
      <ChoiceView />
      <HandView />
      <DeckView />
      <DiscardView />
      <PrivateTrashView />
    </>
  )
}
