import { useContext } from 'react'
import { playerContext } from '../reader/player'
import PlayAreaView from './PlayArea'

export default function TrashView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <PlayAreaView fn='untrashScheme' label='Trash' id={playerState.trashId} />
  )
}
