import { Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../context/streamer/player'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const player = playerState.docs?.[0]
  const hand = player?.hand.map((rank) => <Text key={rank}>{rank}</Text>)
  return (
    <>
      <Text>Hand:</Text>
      {hand}
    </>
  )
}
