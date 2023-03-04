import { Stack } from '@chakra-ui/react'
import GamesProvider from '../context/games/Provider'
import GamesViewer from './viewer/Games'

export default function GamesContentView (): JSX.Element {
  return (
    <GamesProvider>
      <Stack>
        <GamesViewer />
      </Stack>
    </GamesProvider>
  )
}
