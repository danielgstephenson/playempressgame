import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import GameActions from './GameActions'

export default function GameHeading (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.phase !== 'join') return <></>
  return (
    <Heading size='lg' textAlign='center'>
      Game {gameState.id} <GameActions />
    </Heading>
  )
}
