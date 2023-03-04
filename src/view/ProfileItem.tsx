import { Text } from '@chakra-ui/react'
import PlayerProvider from '../context/player/Provider'
import ProfileProvider from '../context/profile/Provider'
import { Profile } from '../types'
import PlayerViewer from './viewer/Player'

export default function ProfileItemView (profile: Profile): JSX.Element {
  return (
    <ProfileProvider profile={profile}>
      <Text>{profile.userId}</Text>
      <PlayerProvider>
        <PlayerViewer />
      </PlayerProvider>
    </ProfileProvider>
  )
}
