import { useContext } from 'react'
import { playerContext } from '../reader/player'
import getSilverColor from '../service/getSilverColor'
import Status from './Status'
import { Text } from '@chakra-ui/react'

export default function PlayerSilverView (): JSX.Element {
  const { silver } = useContext(playerContext)
  const silverColor = getSilverColor({ bg: 'gray.800' })
  return <Status label='Silver'><Text color={silverColor}>{silver}</Text></Status>
}
