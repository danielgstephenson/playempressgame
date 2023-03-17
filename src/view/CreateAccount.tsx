import { Auth, signInAnonymously } from 'firebase/auth'
import { useState } from 'react'
import ChakraWriting from '../lib/firewrite/chakra/Writing'

export default function CreateAccountView ({ auth }: {
  auth: Auth
}): JSX.Element {
  const [createAccountLoading, setCreateAccountLoading] = useState(false)
  const [createAccountError, setCreateAccountError] = useState<Error>()
  async function createAccount (): Promise<void> {
    try {
      setCreateAccountLoading(true)
      await signInAnonymously(auth)
      setCreateAccountLoading(false)
    } catch (error) {
      setCreateAccountError(error as Error)
    }
  }
  return (
    <ChakraWriting
      label='New Account'
      write={createAccount}
      loading={createAccountLoading}
      error={createAccountError}
    />
  )
}
