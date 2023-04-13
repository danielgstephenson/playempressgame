import { deleteDoc } from 'firelord'
import { auth } from "firebase-functions"
import { usersLord } from "../db"

const onDeleteUser = auth.user().onDelete(async user => {
  console.log(`deleting ${user.uid}...`)
  const userRef = usersLord.doc(user.uid)
  await deleteDoc(userRef)
  console.log(`${user.uid} deleted!`)
})

export default onDeleteUser