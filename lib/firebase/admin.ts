import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let appInitialized = false;
const apps = getApps();

if (!apps.length) {
  // If we have a private key, we are running locally or in Vercel
  const hasPrivateKey = process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('PLACEHOLDER');

  if (hasPrivateKey) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    try {
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
      });
      appInitialized = true;
    } catch (error) {
      console.error('[Firebase Admin] Failed to initialize App (Cert):', error);
    }
  } else {
    // If no private key is provided, try dropping down to Application Default Credentials
    // This is how Firebase Functions handles auth automatically.
    try {
      initializeApp();
      appInitialized = true;
      console.log('[Firebase Admin] Initialized via Application Default Credentials (Cloud environment).');
    } catch (error) {
      console.warn('[Firebase Admin] Failed ADC init. Server running on mock/client queries only.');
    }
  }
} else {
  appInitialized = true;
}

export const adminDb = appInitialized ? getFirestore() : null as any;
export const adminAuth = appInitialized ? getAuth() : null as any;


