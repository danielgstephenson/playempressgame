import { useContext } from 'react'
import playContext from '../context/play'
import { playerContext } from '../reader/player'
import SchemeAreaView from './SchemeAreaView'

export default function TrashAreaView (): JSX.Element {
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  return (
    <SchemeAreaView
      areaId='trashArea'
      schemeId={playState.trashSchemeId}
      scheme={playerState.trashScheme}
    />
  )
}
