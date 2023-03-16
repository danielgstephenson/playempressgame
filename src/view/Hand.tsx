import { Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../reader/player'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const hand = playerState.hand?.map((rank) => <Text key={rank}>{rank}</Text>)
  return (
    <>
      <Text>Hand:</Text>
      {hand}
    </>
  )
}
