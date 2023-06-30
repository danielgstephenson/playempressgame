import { Box, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import ActiveHeading from './ActiveHeading'
import TrashAreaView from './TrashArea'
import TrashChoiceView from './TrashChoiceView'
import TrashHistoryView from './TrashHistory'

export default function PrivateTrashView (): JSX.Element {
  const playState = useContext(playContext)
  return (
    <Box>
      <ActiveHeading active={playState.overTrash}>Trash</ActiveHeading>
      <HStack spacing='2px' alignItems='start'>
        <TrashHistoryView />
        <TrashAreaView />
        <TrashChoiceView />
      </HStack>
    </Box>
  )
}
