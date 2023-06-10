import { useContext } from 'react'
import playContext from '../context/play'
import SchemeAreaView from './SchemeAreaView'

export default function TrashAreaView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyTrash?.()
  }
  return (
    <SchemeAreaView
      onReturn={handleReturn}
      label='Trash'
      scheme={playState.trashScheme}
    />
  )
}
