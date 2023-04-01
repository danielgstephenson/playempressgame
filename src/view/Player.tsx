import { Alert, Box } from '@chakra-ui/react'
import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashView from './Trash'
import PlayView from './Play'
import PlayerActionsView from './PlayerActions'

export default function PlayerView (): JSX.Element {
  return (
    <Alert>
      <Box>
        <TrashView />
        <PlayView />
        <HandView />
        <DeckView />
        <DiscardView />
        <PlayerActionsView />
      </Box>
    </Alert>
  )
}
