import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import 'server-only'; // Enforces that this module can NEVER be imported in Client Components

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
	throw new Error(
		'Missing Firebase Admin environment variables in .env.local',
	);
}

// Prevent re-initialization during development (HMR)
const adminApp =
	getApps().length === 0
		? initializeApp({
				credential: cert({
					projectId,
					clientEmail,
					privateKey,
				}),
			})
		: getApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
