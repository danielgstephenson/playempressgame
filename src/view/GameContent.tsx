import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import { Box, Stack } from '@chakra-ui/react'
import TotalView from './Total'
import TimelineView from './Timeline'
import authContext from '../context/auth'
import isTaking from '../service/isTaking'
import functionsContext from '../context/functions'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  if (authState.currentUser?.uid == null || functionsState.functions == null) return <></>
  const taking = isTaking({ profiles: gameState.profiles, userId: authState.currentUser.uid, choices: gameState.choices })
  const showContent = !taking && gameState.phase !== 'join'
  return (
    <Stack direction='column' flexGrow='1' height='100%' overflow='hidden' spacing='4px'>
      <Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Curtain open={showContent}>
            <PalaceView />
            <TotalView />
            <TimelineView />
          </Curtain>
        </Stack>
      </Box>
      <ProfilesView />
    </Stack>
  )
}
