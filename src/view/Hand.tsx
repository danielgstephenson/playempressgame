import { useContext } from 'react'
import { playerContext } from '../reader/player'
import CardPoolView from './CardPool'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <CardPoolView label='Hand' cardGroup={playerState.hand} />
  )
}
