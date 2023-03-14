import { Stack } from '@chakra-ui/react'
import { GamesStreamer } from '../reader/game'

export default function GamesContentView (): JSX.Element {
  return (
    <Stack>
      <GamesStreamer />
    </Stack>
  )
}
