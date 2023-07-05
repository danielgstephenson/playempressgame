import { useContext } from 'react'
import { playerContext } from '../reader/player'
import TinySchemeAreaView from './TinySchemeArea'
import TinySchemeCenterView from './TinySchemeCenter'

export default function DiscardView (): JSX.Element {
  const playerState = useContext(playerContext)
  if (playerState.discard?.length === 0) {
    return <TinySchemeCenterView />
  }
  return (
    <TinySchemeAreaView
      label='Discard'
      schemes={playerState.discard}
    />
  )
}
