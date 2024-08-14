import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref } from "firebase/database";

import {
    getFirestore,
} from 'firebase/firestore';
import { Employee } from '../data/type';
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);

export const listEmployees = async (): Promise<Record<string, Employee> | undefined> => {
    const EmployeesRef = ref(realtime, '/work/employees');
    const snapshot = await get(EmployeesRef);
    if (!snapshot.exists()) return undefined;
    return snapshot.val();
}
