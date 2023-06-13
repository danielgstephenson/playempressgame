import { Auth } from 'firebase/auth'
import { useState, useEffect, useContext } from 'react'
import authContext from '../../context/auth'
import { DisplayNameState } from '../../types'
import wait from './wait'

export default function useDisplayName (auth: Auth): DisplayNameState {
  const [displayName, setDisplayName] = useState<string>()
  const { unauth, setSignOutErrorMessage } = useContext(authContext)
  useEffect(() => {
    if (auth == null) {
      console.warn('No auth provided to useDisplayName.')
      return
    }
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser == null) {
        console.warn('There is no authenticated user.')
        return
      }
      if (authUser.displayName != null) {
        setDisplayName(authUser.displayName)
        return
      }
      async function reload (): Promise<void> {
        while (authUser?.displayName == null) {
          console.info('Reloading user without display name...')
          await authUser?.reload()
          await wait(3000)
          if (authUser?.displayName == null) {
            setSignOutErrorMessage?.('This user has no display name.')
          } else {
            setDisplayName(authUser.displayName)
          }
        }
      }
      void reload()
    })

    function cleanup (): void {
      unsubscribe()
    }

    return cleanup
  }, [auth, unauth, setSignOutErrorMessage])
  return { displayName, setDisplayName }
}
