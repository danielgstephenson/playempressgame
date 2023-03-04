import { Stack } from '@chakra-ui/react'
import ProfilesProvider from '../context/profiles/Provider'
import ProfilesViewer from './viewer/Profiles'

export default function ProfilesView (): JSX.Element {
  return (
    <ProfilesProvider>
      <Stack>
        <ProfilesViewer />
      </Stack>
    </ProfilesProvider>
  )
}
