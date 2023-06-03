import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashAreaView from './TrashArea'
import PlayAreaView from './PlayArea'
import PlayerActionsView from './PlayerActions'
import PlayerHistoryView from './PlayerHistory'
import ChoiceView from './Choice'
import PrivateTrashView from './PrivateTrash'
import BidView from './Bid'
import { useContext, useEffect } from 'react'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function PlayerView (): JSX.Element {
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  useEffect(() => {
    playState.trash?.(playerState.trashScheme)
    playState.play?.(playerState.playScheme)
  }, [playerState.id])
  return (
    <>
      <PlayerHistoryView />
      <PlayerActionsView />
      <PlayAreaView />
      <TrashAreaView />
      <BidView />
      <ChoiceView />
      <HandView />
      <PrivateTrashView />
      <DeckView />
      <DiscardView />
    </>
  )
}
