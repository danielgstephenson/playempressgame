import { useContext } from 'react'
import { Heading } from '@chakra-ui/react'

import authContext from '../context/auth'

import AuthView from './Auth'
import UsersContentView from './UsersContent'
import dbContext from '../context/db'

export default function UsersView (): JSX.Element {
  const dbState = useContext(dbContext)
  const authState = useContext(authContext)
  const content = authState.currentUser != null && dbState.db != null && <UsersContentView db={dbState.db} />
  return (
    <>
      <Heading>Users <AuthView user={authState.currentUser} /></Heading>
      {content}
    </>
  )
}
