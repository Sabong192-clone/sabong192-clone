// 📁 src/utils/logout.ts
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


// 📁 src/utils/updateUserRole.ts
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateUserRole = async (uid: string, newRole: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role: newRole });
};


// 📁 src/utils/uploadFile.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage();

export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};


// 📁 functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.userRoleChanged = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.role !== after.role) {
      console.log(`User ${context.params.userId} role changed from ${before.role} to ${after.role}`);
      // Trigger optional logic here
    }
    return null;
  });


// 📁 src/utils/updateASIStatus.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateASIStatus = async (status: string) => {
  await setDoc(doc(db, "asiStatus", "status"), {
    status,
    lastPing: Date.now(),
  });
};
