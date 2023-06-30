import { Box, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { playerContext } from '../reader/player'
import ActiveHeading from './ActiveHeading'
import PlayAreaView from './PlayArea'
import TinySchemesView from './TinySchemes'

export default function PrivateTableauView (): JSX.Element {
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  return (
    <Box flexGrow='1'>
      <ActiveHeading active={playState.overPlay}>Play</ActiveHeading>
      <HStack spacing='2px'>
        <PlayAreaView />
        <TinySchemesView schemes={playerState.tableau} />
      </HStack>
    </Box>
  )
}
