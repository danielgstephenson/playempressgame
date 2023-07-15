import { Box, Heading } from '@chakra-ui/react'
import DiscardContentView from './DiscardContent'

export default function DiscardView (): JSX.Element {
  return (
    <Box>
      <Heading size='sm'>Discard</Heading>
      <DiscardContentView />
    </Box>
  )
}
