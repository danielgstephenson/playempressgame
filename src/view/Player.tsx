import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'

export default function PlayerView (): JSX.Element {
  return (
    <>
      <HandView />
      <DeckView />
      <DiscardView />
    </>
  )
}
