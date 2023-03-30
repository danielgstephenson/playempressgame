import { Alert, Box } from '@chakra-ui/react'
import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'

export default function PlayerView (): JSX.Element {
  return (
    <Alert>
      <Box>
        <HandView />
        <DeckView />
        <DiscardView />
      </Box>
    </Alert>
  )
}
