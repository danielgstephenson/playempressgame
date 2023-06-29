import { Box, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { SCHEME_WIDTH } from '../constants'
import playContext from '../context/play'
import ActiveHeading from './ActiveHeading'
import TrashAreaView from './TrashArea'
import TrashHistoryView from './TrashHistory'

export default function PrivateTrashView (): JSX.Element {
  const playState = useContext(playContext)
  return (
    <Box minW={SCHEME_WIDTH}>
      <ActiveHeading active={playState.overTrash}>Trash</ActiveHeading>
      <HStack spacing='2px' alignItems='start'>
        <TrashHistoryView />
        <TrashAreaView />
      </HStack>
    </Box>
  )
}
