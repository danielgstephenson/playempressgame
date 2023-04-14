import { auth } from 'firebase-functions'
import { createDoc } from 'firelord'
import { createId } from '../create/id'
import { adminAuth, usersLord } from '../db'

const onCreateUser = auth.user().onCreate(async user => {
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  console.log(`adding ${user.uid}...`)
  const userRef = usersLord.doc(user.uid)
  await createDoc(userRef, newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

export default onCreateUser
