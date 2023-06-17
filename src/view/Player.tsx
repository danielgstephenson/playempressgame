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
  const { reorder, trash, play } = useContext(playContext)
  const { deck } = useContext(playerContext)
  useEffect(() => {
    trash?.(undefined)
    play?.(undefined)
  }, [round, trash, play])
  useEffect(() => {
    if (deck == null) {
      return
    }
    reorder?.(deck)
  }, [deck])

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
