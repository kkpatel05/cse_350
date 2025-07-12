const functions = require("firebase-functions");

function isAuthenticated(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  return context.auth.uid;
}

module.exports = { isAuthenticated };
