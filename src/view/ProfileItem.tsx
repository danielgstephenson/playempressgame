import { Text } from '@chakra-ui/react'

import { Profile } from '../types'

export default function ProfileItemView (profile: Profile): JSX.Element {
  return <Text>{profile.userId}</Text>
}
