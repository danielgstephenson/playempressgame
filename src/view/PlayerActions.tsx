import { Box } from '@chakra-ui/react'
import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function PlayerActionsView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const showReady = playState.trashScheme != null && playState.playScheme != null && playerState.ready !== true
  const props = {
    gameId: gameState.id,
    trashSchemeId: playState.trashScheme?.id,
    playSchemeId: playState.playScheme?.id
  }
  return (
    <Box>
      <Curtain open={showReady}>
        <Cloud
          fn='playReady'
          label='Ready'
          props={props}
        />
      </Curtain>
    </Box>
  )
}
