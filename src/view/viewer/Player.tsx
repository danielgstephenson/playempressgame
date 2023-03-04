import { useContext } from 'react'
import playerContext from '../../context/player'
import PlayerView from '../Player'
import DocViewer from './Doc'

export default function PlayerViewer (): JSX.Element {
  const playerState = useContext(playerContext)
  if (playerState.playerStream == null) return <></>
  return <DocViewer stream={playerState.playerStream} View={PlayerView} />
}
