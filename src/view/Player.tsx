import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashView from './Trash'
import PlayView from './Play'
import PlayerActionsView from './PlayerActions'
import PlayerHistoryView from './PlayerHistory'
import ChoiceView from './Choice'

export default function PlayerView (): JSX.Element {
  return (
    <>
      <TrashView />
      <PlayView />
      <ChoiceView />
      <HandView />
      <DeckView />
      <DiscardView />
      <PlayerActionsView />
      <PlayerHistoryView />
    </>
  )
}
