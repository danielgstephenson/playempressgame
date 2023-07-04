import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import { Box, Stack } from '@chakra-ui/react'
import CourtTakeView from './Take'
import TotalView from './Total'
import TimelineView from './Timeline'
import authContext from '../context/auth'
import isTaking from '../service/isTaking'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  if (authState.currentUser?.uid == null) return <></>
  const taking = isTaking({ game: gameState, userId: authState.currentUser.uid })
  const showContent = !taking && gameState.phase !== 'join'
  return (
    <Stack direction='column' flexGrow='1' height='100%' overflow='hidden'>
      <Box>
        <Stack direction='row' justifyContent='space-between'>
          <Curtain open={showContent}>
            <PalaceView />
            <TotalView />
            <TimelineView />
          </Curtain>
        </Stack>
      </Box>
      <CourtTakeView />
      <ProfilesView />
    </Stack>
  )
}
