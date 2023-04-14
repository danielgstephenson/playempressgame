import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Box } from '@chakra-ui/react'
import Action from './Action'
import authContext from '../context/auth'
import Curtain from './Curtain'

export default function GameActions (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  if (gameState.id == null || gameState.users == null || authState.authed !== true || authState.currentUser?.uid == null) return <></>
  const joinedUser = gameState.users.find((user) => user.id === authState.currentUser?.uid)
  const joined = joinedUser != null
  const joinPhase = gameState.phase === 'join'
  const showJoin = !joined && joinPhase
  const showStart = joined && joinPhase && gameState.users.length > 1
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
