import { Auth } from 'firebase/auth'
import { useState, useEffect } from 'react'

export default function useDisplayName (auth?: Auth): string | undefined {
  const [displayName, setDisplayName] = useState<string>()
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
          await authUser?.reload()
          console.warn('Reloading user without display name...')
          if (authUser?.displayName == null) {
            throw new Error('This user has no display name.')
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
