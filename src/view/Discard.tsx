import { useContext } from 'react'
import { playerContext } from '../reader/player'
import StaticCircleAreaView from './StaticCircleArea'

export default function DiscardView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <StaticCircleAreaView
      label='Discard'
      schemes={playerState.discard}
    />
  )
}
