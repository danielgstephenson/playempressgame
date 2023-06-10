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
        return
      }
      async function reload (): Promise<void> {
        console.info('Reloading user without display name...')
        await authUser?.reload()
        if (authUser?.displayName == null) {
          console.warn('Reloading user without display name...')
          await wait(5000)
          console.log('reloading...')
          await authUser?.reload()
          console.log('authUser', authUser)
          if (authUser?.displayName == null) {
            console.log('before signout')
            await unauth?.()
            console.log('after signout')
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
  }, [auth, unauth, setSignOutErrorMessage])
  return { displayName, setDisplayName }
}
