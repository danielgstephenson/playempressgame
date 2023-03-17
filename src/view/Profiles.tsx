import { Stack, Text } from '@chakra-ui/react'
import ProfilesReader from '../reader/profile'
import ProfileItemView from './ProfileItem'

export default function ProfilesView (): JSX.Element {
  return (
    <Stack>
      <ProfilesReader DocView={ProfileItemView}>
        <Text>Profiles</Text>
      </ProfilesReader>
    </Stack>
  )
}
