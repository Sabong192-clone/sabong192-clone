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