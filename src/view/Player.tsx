import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashView from './Trash'
import PlayView from './Play'
import PlayerActionsView from './PlayerActions'
import PlayerHistoryView from './PlayerHistory'

export default function PlayerView (): JSX.Element {
  return (
    <>
      <TrashView />
      <PlayView />
      <HandView />
      <DeckView />
      <DiscardView />
      <PlayerActionsView />
      <PlayerHistoryView />
    </>
  )
}
