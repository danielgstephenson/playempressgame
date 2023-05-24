import { useContext } from 'react'
import playContext from '../context/play'
import PlayAreaView from './PlayArea'

export default function PlayView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyPlay?.()
  }
  return (
    <PlayAreaView
      onReturn={handleReturn}
      label='Play'
      scheme={playState.playScheme}
    />
  )
}
