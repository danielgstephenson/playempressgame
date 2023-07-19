import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import SchemeAreaView from './SchemeAreaView'

export default function TrashAreaView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const ready = gameState.profiles?.every(profile => profile.playReady) === true
  if (ready) {
    return <></>
  }
  return (
    <SchemeAreaView
      areaId='trashArea'
      schemeId={playState.trashSchemeId}
      scheme={playerState.trashScheme}
    />
  )
}
