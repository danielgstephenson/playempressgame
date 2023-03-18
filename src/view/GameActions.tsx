import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Box } from '@chakra-ui/react'
import Action from './Action'

export default function GameActions (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.id == null) return <></>
  return (
    <Box>
      <Action
        fn='joinGame'
        label='Join Game'
        props={{ gameId: gameState.id }}
      />
      {' '}
      <Action
        fn='startGame'
        label='Start Game'
        props={{ gameId: gameState.id }}
        onCall={async (cloudFunction, props) => {
          console.log('before')
          await cloudFunction(props)
          console.log('after')
        }}
      />
    </Box>
  )
}
