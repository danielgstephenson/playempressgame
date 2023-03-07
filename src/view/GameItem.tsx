import { useContext } from 'react'
import { gameContext } from '../context/firestream/game'
import ChakraLinkView from './ChakraLink'

export default function GameItemView (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.name == null) return <></>
  const to = `/game/${gameState.name}`
  return <ChakraLinkView to={to}>{gameState.id}</ChakraLinkView>
}
