import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import TinySchemeAreaView from './TinySchemeArea'
import { Box, Stack } from '@chakra-ui/react'
import CourtTakeView from './Take'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()
  return (
    <>
      <Box>
        <Stack direction='row' justifyContent='space-between'>
          <Curtain open={showContent}>
            <PalaceView />
            <TinySchemeAreaView label='Timeline' schemes={timeline} />
          </Curtain>
        </Stack>
      </Box>
      <CourtTakeView />
      <ProfilesView />
    </>
  )
}
