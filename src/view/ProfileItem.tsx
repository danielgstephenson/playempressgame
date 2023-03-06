import { Text } from '@chakra-ui/react'
import { ProfileProvider } from '../context/streamer/profile'
import { Profile } from '../types'
import PlayerStreamer from '../context/streamer/player'

export default function ProfileItemView (profile: Profile): JSX.Element {
  return (
    <ProfileProvider doc={profile}>
      <Text>{profile.userId}</Text>
      <PlayerStreamer />
    </ProfileProvider>
  )
}
