import { useContext } from 'react'
import { Heading } from '@chakra-ui/react'
import { Firestore } from 'firebase/firestore'

import authContext from '../context/auth'

import AuthView from './Auth'
import UsersContentView from './UsersContent'

export default function UsersView ({ db }: { db: Firestore }): JSX.Element {
  const authState = useContext(authContext)
  const content = authState.user != null && <UsersContentView db={db} />
  return (
    <>
      <Heading>Users <AuthView user={authState.user} /></Heading>
      {content}
    </>
  )
}
