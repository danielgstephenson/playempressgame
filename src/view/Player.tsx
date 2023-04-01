import { Alert, Box } from '@chakra-ui/react'
import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashView from './Trash'

export default function PlayerView (): JSX.Element {
  return (
    <Alert>
      <Box>
        <TrashView />
        <HandView />
        <DeckView />
        <DiscardView />
      </Box>
    </Alert>
  )
}
