import { Box, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import TimelineView from './Timeline'
import TotalView from './Total'

export default function CenterView ({ taking = false }: { taking?: boolean }): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = !taking && gameState.phase !== 'join'
  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Curtain open={showContent}>
          <PalaceView />
          <TotalView />
          <TimelineView />
        </Curtain>
      </Stack>
    </Box>
  )
}
