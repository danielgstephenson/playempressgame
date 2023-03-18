import { useContext } from 'react'
import authContext from '../context/auth'
import Action from './Action'

export default function AddGameView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.authed !== true) {
    return <></>
  }
  return (
    <Action
      label='Add Game'
      fn='addGame'
    />
  )
}
