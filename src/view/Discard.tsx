import { useContext } from 'react'
import { playerContext } from '../reader/player'
import CardStackView from './CardStack'

export default function DiscardView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <CardStackView label='Discard' cardGroup={playerState.discard} />
  )
}
