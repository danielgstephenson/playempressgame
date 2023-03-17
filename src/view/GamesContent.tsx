import { Stack } from '@chakra-ui/react'
import { GamesReader } from '../reader/game'
import GameItemView from './GameItem'

export default function GamesContentView (): JSX.Element {
  return (
    <Stack>
      <GamesReader DocView={GameItemView} />
    </Stack>
  )
}
