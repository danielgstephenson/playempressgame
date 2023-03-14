import { Stack, Text } from '@chakra-ui/react'
import ProfilesSharer from '../reader/profile'

export default function ProfilesView (): JSX.Element {
  return (
    <Stack>
      <ProfilesSharer>
        <Text>Profiles</Text>
      </ProfilesSharer>
    </Stack>
  )
}
