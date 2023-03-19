import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Clink from 'clink-react'

export default function GameItemView (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.name == null) return <></>
  const to = `/game/${gameState.name}`
  return <Clink to={to}>{gameState.id}</Clink>
}
