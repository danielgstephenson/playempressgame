import { Game } from '../types'
import ProfilesView from './Profiles'
import { Box, Text } from '@chakra-ui/react'

export default function GameContentView (game: Game): JSX.Element {
  const timeline = game.timeline.map((rank) => <Box key={rank}>{rank}</Box>)
  return (
    <>
      <Text>Phase: {game.phase}</Text>
      <Text>Timeline:</Text>
      {timeline}
      <ProfilesView gameId={game.id} />
    </>
  )
}
