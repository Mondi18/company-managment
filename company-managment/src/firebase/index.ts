import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, get, query, orderByChild, equalTo, set, onValue, update } from "firebase/database";

import {
    doc,
    getDoc,
    getFirestore,
} from 'firebase/firestore';
import { Order } from "../orders/types";
import { Driver } from "../drivers/types";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);
