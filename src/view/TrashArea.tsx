import { useContext } from 'react'
import playContext from '../context/play'
import TableauView from './Tableau'

export default function TrashAreaView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyTrash?.()
  }
  return (
    <TableauView
      onReturn={handleReturn}
      label='Trash'
      scheme={playState.trashScheme}
    />
  )
}
