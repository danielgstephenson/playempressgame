import { Stack, Text } from '@chakra-ui/react'
import ProfilesReader from './reader/profile'

export default function ProfilesView (): JSX.Element {
  return (
    <Stack>
      <ProfilesReader>
        <Text>Profiles</Text>
      </ProfilesReader>
    </Stack>
  )
}
