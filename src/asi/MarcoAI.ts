// asi/MarcoAI.ts
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore'

export async function monitorDepositsAndDetectFraud() {
  const usersRef = collection(db, 'users')
  const snapshot = await getDocs(usersRef)
  
  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data()
    if (data.deposits && Array.isArray(data.deposits)) {
      const suspicious = detectFraudPattern(data.deposits)
      if (suspicious) {
        await updateDoc(doc(db, 'users', docSnap.id), {
          flagged: true,
          flaggedReason: 'Suspicious deposit pattern'
        })
      }
    }
  })
}

function detectFraudPattern(deposits: number[]): boolean {
  // Simplified logic: very frequent small deposits or huge instant spikes
  const largeSpike = deposits.some((v, i) => i > 0 && (v - deposits[i - 1]) > 10000)
  const tooFrequent = deposits.length >= 10 && deposits.slice(-5).every(v => v < 100)
  return largeSpike || tooFrequent
}

export function analyzePlayerBehavior(playerData: any) {
  const behaviorScore = computeBehaviorScore(playerData)
  return behaviorScore
}

function computeBehaviorScore(data: any): number {
  let score = 0
  if (data.dailyLoginStreak >= 7) score += 20
  if (data.totalSpins > 50) score += 15
  if (data.totalReferrals > 10) score += 25
  if (data.positiveWinRate > 0.7) score += 20
  return score
}

export async function handleVoiceBetCommand(command: string, userId: string) {
  const cleaned = command.toLowerCase().trim()
  const amountMatch = cleaned.match(/bet (\d+)/)
  if (!amountMatch) return 'Invalid command'

  const amount = parseInt(amountMatch[1])
  if (isNaN(amount) || amount < 20) return 'Bet too low'

  // Simulate placing bet
  await updateDoc(doc(db, 'bets', userId), { latestBet: amount })
  return `✅ Bet of ₱${amount} has been placed.`
}

export async function notifyMilestones(userId: string, milestone: string) {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    lastMilestone: milestone
  })

  // Assume Marco handles notification trigger elsewhere
  console.log(`🎉 Milestone achieved for ${userId}: ${milestone}`)
}
