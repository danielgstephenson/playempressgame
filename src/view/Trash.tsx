import { useContext } from 'react'
import playContext from '../context/play'
import PlayAreaView from './PlayArea'

export default function TrashView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyTrash?.()
  }
  return (
    <PlayAreaView
      onReturn={handleReturn}
      label='Trash'
      scheme={playState.trashScheme}
    />
  )
}
