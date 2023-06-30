import { useContext } from 'react'
import playContext from '../context/play'
import TakePalaceView from './TakePalace'

export default function TakeCourtView (): JSX.Element {
  const playState = useContext(playContext)
  return (
    <TakePalaceView schemes={playState.court}>
      Court
    </TakePalaceView>
  )
}
