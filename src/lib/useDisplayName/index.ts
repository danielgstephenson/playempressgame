import { Auth } from 'firebase/auth'
import { useState, useEffect, useContext } from 'react'
import authContext from '../../context/auth'
import wait from './wait'

export default function useDisplayName (auth: Auth): string | undefined {
  const [displayName, setDisplayName] = useState<string>()
  const { signOut, setSignOutErrorMessage } = useContext(authContext)
  useEffect(() => {
    if (auth == null) {
      console.warn('No auth provided to useDisplayName.')
      return
    }
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      async function reload (): Promise<void> {
        if (authUser == null) {
          return
        }

        console.info('Reloading user without display name...')
        await authUser?.reload()
        if (authUser?.displayName == null) {
          console.warn('Reloading user without display name...')
          await wait(3000)
          await authUser?.reload()
          if (authUser?.displayName == null) {
            await signOut?.()
            setSignOutErrorMessage?.('This user has no display name.')
          } else {
            setDisplayName(authUser.displayName)
          }
        } else {
          setDisplayName(authUser.displayName)
        }
      }
      void reload()
    })

    function cleanup (): void {
      unsubscribe()
    }

    return cleanup
  }, [auth])
  return displayName
}
