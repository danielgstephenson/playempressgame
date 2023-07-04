import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import SchemeAreaView from './SchemeAreaView'

export default function PlayAreaView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const ready = gameState.profiles?.every(profile => profile.playReady) === true
  const choosing = gameState.choices != null && gameState.choices.length > 0
  if (ready && !choosing) {
    return <></>
  }
  return (
    <SchemeAreaView
      areaId='playArea'
      label='Play'
      schemeId={playState.playSchemeId}
      scheme={playerState.playScheme}
    />
  )
}
