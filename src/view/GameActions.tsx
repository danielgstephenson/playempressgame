import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { Box } from '@chakra-ui/react'
import Cloud from './Cloud'
import authContext from '../context/auth'
import Curtain from './Curtain'

export default function GameActions (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  if (
    gameState.id == null ||
    gameState.profiles == null ||
    authState.authed !== true ||
    authState.currentUser?.uid == null
  ) return <></>
  const joinedUser = gameState
    .profiles
    .find((profile) => profile.userId === authState.currentUser?.uid)
  const joined = joinedUser != null
  const joinPhase = gameState.phase === 'join'
  const showJoin = !joined && joinPhase
  const showStart = joined && joinPhase && gameState.profiles.length > 1
  return (
    <Box>
      <Curtain open={showJoin}>
        <Cloud
          fn='joinGame'
          label='Join Game'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
      <Curtain open={showStart}>
        <Cloud
          fn='startGame'
          label='Start Game'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
    </Box>
  )
}
