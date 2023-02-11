import { Spinner, Button, Text } from '@chakra-ui/react'
import { Auth, User, signInAnonymously } from 'firebase/auth'
import { useSignOut } from 'react-firebase-hooks/auth'

export default function AuthContentView ({
  auth, user
}: {
  auth: Auth
  user?: User | null
}): JSX.Element {
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  if (signOutLoading) {
    return <Spinner />
  }
  if (signOutError != null) {
    return <Text>{signOutError.message}</Text>
  }
  async function createAccount (): Promise<void> {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.log(error)
    }
  }
  if (user == null) {
    return <Button onClick={createAccount}>New Account</Button>
  }
  return <Button onClick={signOut}>Sign Out</Button>
}
