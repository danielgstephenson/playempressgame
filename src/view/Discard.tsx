import { useContext } from 'react'
import { playerContext } from '../reader/player'
import TinySchemeAreaView from './TinySchemeArea'

export default function DiscardView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <TinySchemeAreaView
      label='Discard'
      schemes={playerState.discard}
    />
  )
}
