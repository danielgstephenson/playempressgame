import { Game } from '../types'
import ChakraLinkView from './ChakraLink'

export default function GameItemView (game: Game): JSX.Element {
  const to = `/game/${game.name}`
  return <ChakraLinkView to={to}>{game.id}</ChakraLinkView>
}
