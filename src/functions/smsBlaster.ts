// 🔧 ASI CRM SYSTEM: God-Mode Viral CRM w/ SMS, Self-Propagation & Admin Control
// File: /src/utils/asi-crm.ts

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Example using Twilio - you can replace with local PH SMS API if needed
import twilio from 'twilio';

const accountSid = import.meta.env.VITE_TWILIO_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const twilioPhone = import.meta.env.VITE_TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// 🔁 Self-propagating SMS/Referral blast
export const blastSMS = async (adminId: string, message: string) => {
  try {
    // 1. Fetch all users (players) under this admin or globally
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map((doc) => doc.data());

    // 2. Iterate over all users who have a valid phone number
    const results = await Promise.all(
      users.map(async (user) => {
        if (!user.username?.match(/^09\d{9}$/)) return null;
        const toNumber = `+63${user.username.slice(1)}`;

        try {
          const res = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: toNumber
          });
          return { user: user.username, sid: res.sid };
        } catch (err) {
          console.error('Failed to send to', user.username);
          return null;
        }
      })
    );

    toast.success(`✅ Blast sent to ${results.filter(Boolean).length} players.`);
  } catch (err) {
    console.error(err);
    toast.error('❌ Failed to execute SMS blast.');
  }
};

// ➕ Add Admin-only trigger in UI (button in admin dashboard)
// 📣 Sample usage:
// blastSMS(adminId, "🎁 Deposit now & get 10% bonus! Only today!");
