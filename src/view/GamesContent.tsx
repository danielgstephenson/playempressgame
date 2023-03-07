import { Stack } from '@chakra-ui/react'
import { GamesStreamer } from '../context/firestream/game'

export default function GamesContentView (): JSX.Element {
  return (
    <Stack>
      <GamesStreamer />
    </Stack>
  )
}
