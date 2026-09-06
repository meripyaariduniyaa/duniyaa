import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDExyQPw3JWUqsa4g7gFh_ZeJncV3PViUQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'meripyaariduniyaa03.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'meripyaariduniyaa03',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'meripyaariduniyaa03.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '351834807372',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:351834807372:web:00c888b117e391199ae8e9'
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err) {
    let friendlyMessage = err.message;
    if (err.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Sign-in popup was closed before completion. Please try again.';
    } else if (err.code === 'auth/popup-blocked') {
      friendlyMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    } else if (err.code === 'auth/unauthorized-domain') {
      friendlyMessage = 'This domain is not authorized in Firebase Console -> Authentication -> Settings -> Authorized Domains.';
    } else if (err.code === 'auth/network-request-failed') {
      friendlyMessage = 'Network connection failed. Please check your internet connection.';
    }
    return { user: null, error: friendlyMessage, rawError: err };
  }
}

