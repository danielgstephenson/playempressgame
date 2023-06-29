import { useContext } from 'react'
import playContext from '../context/play'
import TinySchemeAreaView from './TinySchemeArea'

export default function StaticCourtView (): JSX.Element {
  const playState = useContext(playContext)
  return (
    <TinySchemeAreaView schemes={playState.court} label='Court' />
  )
}
