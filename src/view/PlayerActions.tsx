import { Box } from '@chakra-ui/react'
import Action from './Action'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import { profileContext } from '../reader/profile'

export default function PlayerActionsView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const profileState = useContext(profileContext)
  const showReady = playerState.trashScheme != null && playerState.playScheme != null && profileState.ready !== true
  const showUnready = profileState.ready === true
  return (
    <Box>
      <Curtain open={showReady}>
        <Action
          fn='playReady'
          label='Ready'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
      <Curtain open={showUnready}>
        <Action
          fn='playUnready'
          label='Unready'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
    </Box>
  )
}
