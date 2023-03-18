import { Auth, User, signInAnonymously } from 'firebase/auth'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { useNavigate } from 'react-router-dom'

export default function AuthContentView ({
  auth, user
}: {
  auth: Auth
  user?: User | null
}): JSX.Element {
  const navigate = useNavigate()
  const [createAccountLoading, setCreateAccountLoading] = useState(false)
  const [createAccountError, setCreateAccountError] = useState<Error>()
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  async function createAccount (): Promise<void> {
    try {
      setCreateAccountLoading(true)
      await signInAnonymously(auth)
      setCreateAccountLoading(false)
    } catch (error) {
      setCreateAccountError(error as Error)
    }
  }
  if (user == null) {
    return <ChakraButton label='New Account' onClick={createAccount} loading={createAccountLoading} error={createAccountError} />
  }
  async function signOutToHome (): Promise<void> {
    await signOut()
    navigate('/')
  }
  return <ChakraButton label='Sign Out' onClick={signOutToHome} loading={signOutLoading} error={signOutError} />
}
