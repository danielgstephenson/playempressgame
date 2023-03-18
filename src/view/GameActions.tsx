import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Box } from '@chakra-ui/react'
import Action from './Action'
import authContext from '../context/auth'
import Curtain from './Curtain'

export default function GameActions (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  if (gameState.id == null || gameState.userIds == null || authState.currentUser == null) return <></>
  const joined = gameState.userIds?.includes(authState.currentUser?.uid)
  const joinPhase = gameState.phase === 'join'
  const showJoin = !joined
  const showStart = joined && joinPhase
  return (
    <Box>
      <Curtain open={showJoin}>
        <Action
          fn='joinGame'
          label='Join Game'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
      <Curtain open={showStart}>
        <Action
          fn='startGame'
          label='Start Game'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
    </Box>
  )
}
