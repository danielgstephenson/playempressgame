import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import StaticCircleAreaView from './StaticCircleArea'
import Cloud from './Cloud'
import playContext from '../context/play'
import { Box, Stack } from '@chakra-ui/react'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  console.log('playState.taken', playState.taken)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()
  return (
    <>
      <Box>
        <Stack direction='row'>
          <Curtain open={showContent}>
            <PalaceView />
            <StaticCircleAreaView label='Timeline' schemes={timeline} />
          </Curtain>
        </Stack>
      </Box>
      <Cloud
        fn='court'
        props={{ gameId: gameState.id, schemeIds: playState.taken }}
      >
        Ready
      </Cloud>
      <ProfilesView />
    </>
  )
}
