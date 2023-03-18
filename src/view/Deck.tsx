import { useContext } from 'react'
import { playerContext } from '../reader/player'
import CardStackView from './CardStack'

export default function DeckView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <CardStackView label='Deck' cardGroup={playerState.deck} />
  )
}
