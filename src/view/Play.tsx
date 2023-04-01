import { useContext } from 'react'
import { playerContext } from '../reader/player'
import PlayAreaView from './PlayArea'

export default function PlayView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <PlayAreaView fn='unplayScheme' label='Play' index={playerState.playIndex} />
  )
}
