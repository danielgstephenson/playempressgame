import { useContext } from 'react'
import { playerContext } from '../reader/player'
import getGoldColor from '../service/getGoldColor'
import Status from './Status'
import { Text } from '@chakra-ui/react'

export default function PlayerGoldView (): JSX.Element {
  const { gold } = useContext(playerContext)
  const goldColor = getGoldColor({ bg: 'gray.800' })
  return <Status label='Gold'><Text color={goldColor}>{gold}</Text></Status>
}
