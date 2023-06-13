import { signInAnonymously } from 'firebase/auth'
import { useContext, useState } from 'react'
import authContext from '../context/auth'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function CreateAccountView (): JSX.Element {
  const authState = useContext(authContext)
  const [createAccountLoading, setCreateAccountLoading] = useState(false)
  const [createAccountError, setCreateAccountError] = useState<Error>()
  if (authState.auth == null || authState.currentUserLoading === true) {
    return <ChakraButton loading>New Account</ChakraButton>
  }
  async function createAccount (): Promise<void> {
    if (authState.auth == null) {
      throw new Error('Auth state is null')
    }
    try {
      setCreateAccountLoading(true)
      await signInAnonymously(authState.auth)
      setCreateAccountLoading(false)
    } catch (error) {
      setCreateAccountError(error as Error)
    }
  }
  return (
    <ChakraButton
      onClick={createAccount}
      loading={createAccountLoading}
      error={createAccountError}
    >
      New Account
    </ChakraButton>
  )
}
