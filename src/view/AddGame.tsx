import { useContext } from 'react'
import authContext from '../context/auth'
import CallerView from './Caller'

export default function AddGameView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.authed !== true) {
    return <></>
  }
  return (
    <CallerView
      label='Add Game'
      action='addGame'
    />
  )
}
