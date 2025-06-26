// ? src/asi/index.ts

import { collection, getDocs, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// ?? Marco's main logic
export const runASIJobs = async () => {
  console.log('?? Marco initializing...')

  await checkSpinEligibility()
  await logLastSync()
  await runFraudDetection()
}

// ?? Check who can spin and log it
const checkSpinEligibility = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'))
  const now = new Date()

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data()
    const uid = userDoc.id

    const totalDeposit = user.weeklyDeposit || 0

    if (totalDeposit >= 10000 && !user.hasSpunThisWeek) {
      const spinLogRef = doc(db, 'spinLogs', uid)
      await setDoc(spinLogRef, {
        userId: uid,
        username: user.username,
        role: user.role,
        totalDeposit,
        spunAt: serverTimestamp(),
        eligible: true,
      })

      await updateDoc(doc(db, 'users', uid), {
        hasSpunThisWeek: true,
      })
    }
  }
}

// ????? Detect suspicious behavior
const runFraudDetection = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'))

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data()
    const uid = userDoc.id

    if (user.balance > 10000 && user.depositCount === 0) {
      await updateDoc(doc(db, 'users', uid), {
        suspicious: true,
      })
    }
  }
}

// ? Timestamp of last Marco sync
const logLastSync = async () => {
  const ref = doc(db, 'asiMeta', 'syncStatus')
  await setDoc(ref, {
    lastSync: serverTimestamp(),
  })
}
