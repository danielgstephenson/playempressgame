import { auth } from 'firebase-functions'
import { createDoc } from 'firelord'
import { createId } from '../create/id'
import { adminAuth, usersRef } from '../db'

const onCreateUser = auth.user().onCreate(async user => {
  console.log(`Adding ${user.uid}...`)
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  const userRef = usersRef.doc(user.uid)
  await createDoc(userRef, newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

export default onCreateUser
