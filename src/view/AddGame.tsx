import { useContext } from 'react'
import authContext from '../context/auth'
import Writer from './Writer'

export default function AddGameView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.authed !== true) {
    return <></>
  }
  return (
    <Writer
      label='Add Game'
      fn='addGame'
    />
  )
}
