import { auth } from "firebase-functions"
import { usersRef } from "../db"

const onDeleteUser = auth.user().onDelete(async user => {
  console.log(`deleting ${user.uid}...`)
  await usersRef.doc(user.uid).delete()
  console.log(`${user.uid} deleted!`)
})

export default onDeleteUser