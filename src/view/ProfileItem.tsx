import { Text } from '@chakra-ui/react'
import { profileContext } from '../streamer/profile'
import PlayerStreamer from '../streamer/player'
import { useContext } from 'react'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <>
      <Text>Profile: {profileState.userId}</Text>
      <PlayerStreamer />
    </>
  )
}
