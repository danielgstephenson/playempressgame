import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashAreaView from './TrashArea'
import PlayAreaView from './PlayArea'
import PlayerActionsView from './PlayerActions'
import PlayerHistoryView from './PlayerHistory'
import ChoiceView from './Choice'
import PlayProvider from '../context/play/Provider'
import PrivateTrashView from './PrivateTrash'
import BidView from './Bid'

export default function PlayerView (): JSX.Element {
  return (
    <PlayProvider>
      <BidView />
      <TrashAreaView />
      <PrivateTrashView />
      <PlayAreaView />
      <ChoiceView />
      <HandView />
      <DeckView />
      <DiscardView />
      <PlayerActionsView />
      <PlayerHistoryView />
    </PlayProvider>
  )
}
