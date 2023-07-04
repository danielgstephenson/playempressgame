import { useContext } from 'react'
import { gameContext } from '../reader/game'
import TinySchemeAreaView from './TinySchemeArea'

export default function TimelineView (): JSX.Element {
  const { timeline } = useContext(gameContext)
  return (
    <TinySchemeAreaView label='Timeline' schemes={timeline} />
  )
}
