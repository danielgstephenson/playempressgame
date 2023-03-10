import { useContext } from 'react'
import ProfilesView from './Profiles'
import { Box, Text } from '@chakra-ui/react'
import { gameContext } from '../streamer/game'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const timeline = gameState.timeline?.map((rank) => <Box key={rank}>{rank}</Box>)
  return (
    <>
      <Text>Phase: {gameState.phase}</Text>
      <Text>Timeline:</Text>
      {timeline}
      <ProfilesView />
    </>
  )
}
