import { useContext } from 'react'
import authContext from '../../context/auth'
import Writer from '.'

export default function AddGameWriter (): JSX.Element {
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
