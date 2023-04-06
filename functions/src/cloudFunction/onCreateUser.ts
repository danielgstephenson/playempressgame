import { auth } from "firebase-functions"
import { createId } from "../create/id"
import { adminAuth, usersRef } from "../db"

const onCreateUser = auth.user().onCreate(async user => {
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  console.log(`adding ${user.uid}...`)
  await usersRef.doc(user.uid).set(newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

export default onCreateUser