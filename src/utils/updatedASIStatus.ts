// 📁 src/utils/updateASIStatus.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateASIStatus = async (status: string) => {
  await setDoc(doc(db, "asiStatus", "status"), {
    status,
    lastPing: Date.now(),
  });
};


// 📁 src/components/ASIWidget.tsx
import { Card } from "@/components/ui/card";

export const ASIWidget = ({ systemStatus }) => (
  <Card className="p-4 bg-gradient-to-br from-black to-gray-900 text-green-300">
    <h2 className="text-xl">🧠 ASI Monitoring</h2>
    <p>Status: {systemStatus?.status}</p>
    <p>Last Ping: {new Date(systemStatus?.lastPing).toLocaleString()}</p>
  </Card>
);