import { useContext } from 'react'
import playContext from '../context/play'
import TableauView from './Tableau'

export default function PlayAreaView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyPlay?.()
  }
  return (
    <TableauView
      onReturn={handleReturn}
      label='Play'
      scheme={playState.playScheme}
    />
  )
}
