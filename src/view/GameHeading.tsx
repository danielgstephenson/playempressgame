import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import GameWriters from './GameWriters'

export default function GameHeading (): JSX.Element {
  const gameState = useContext(gameContext)
  return (
    <Heading>
      Game {gameState.id}
      <GameWriters />
    </Heading>
  )
}
