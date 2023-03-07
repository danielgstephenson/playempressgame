import { Stack, Text } from '@chakra-ui/react'
import ProfilesStreamer from '../context/firestream/profile'

export default function ProfilesView (): JSX.Element {
  return (
    <Stack>
      <ProfilesStreamer>
        <Text>Profiles</Text>
      </ProfilesStreamer>
    </Stack>
  )
}
