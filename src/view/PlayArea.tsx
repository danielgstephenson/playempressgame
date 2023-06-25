import { useContext } from 'react'
import playContext from '../context/play'
import { playerContext } from '../reader/player'
import SchemeAreaView from './SchemeAreaView'

export default function PlayAreaView (): JSX.Element {
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  return (
    <SchemeAreaView
      areaId='playArea'
      label='Play'
      schemeId={playState.playSchemeId}
      scheme={playerState.playScheme}
    />
  )
}
