import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

import {
    getFirestore,
} from 'firebase/firestore';
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);
