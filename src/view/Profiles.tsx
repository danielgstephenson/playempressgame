import { Stack, Text } from '@chakra-ui/react'
import ProfilesStreamer from '../streamer/profile'

export default function ProfilesView (): JSX.Element {
  return (
    <Stack>
      <ProfilesStreamer>
        <Text>Profiles</Text>
      </ProfilesStreamer>
    </Stack>
  )
}
