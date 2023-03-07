import { Stack } from '@chakra-ui/react'
import { GamesStreamer } from '../context/streamer/game'

export default function GamesContentView (): JSX.Element {
  return (
    <Stack>
      <GamesStreamer />
    </Stack>
  )
}
