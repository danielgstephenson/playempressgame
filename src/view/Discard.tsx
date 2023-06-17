import { useContext } from 'react'
import { playerContext } from '../reader/player'
import StaticAreaView from './StaticArea'

export default function DiscardView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <StaticAreaView
      label='Discard'
      schemes={playerState.discard}
    />
  )
}
