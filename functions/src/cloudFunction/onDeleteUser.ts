import { deleteDoc } from 'firelord'
import { auth } from 'firebase-functions'
import { usersRef } from '../db'

const onDeleteUser = auth.user().onDelete(async user => {
  console.info(`Deleting ${user.uid}...`)
  const userRef = usersRef.doc(user.uid)
  await deleteDoc(userRef)
  console.info(`User ${user.uid} deleted!`)
})

export default onDeleteUser
