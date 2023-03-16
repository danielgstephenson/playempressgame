import { Stack } from '@chakra-ui/react'
import { GamesReader } from './reader/game'

export default function GamesContentView (): JSX.Element {
  return (
    <Stack>
      <GamesReader />
    </Stack>
  )
}
