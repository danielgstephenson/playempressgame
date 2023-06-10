import { useContext } from 'react'
import playContext from '../context/play'
import SchemeAreaView from './SchemeAreaView'

export default function PlayAreaView (): JSX.Element {
  const playState = useContext(playContext)
  function handleReturn (): void {
    playState.emptyPlay?.()
  }
  return (
    <SchemeAreaView
      onReturn={handleReturn}
      label='Play'
      scheme={playState.playScheme}
    />
  )
}
