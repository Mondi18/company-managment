import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, set, push, update } from "firebase/database";

import {
    getFirestore,
} from 'firebase/firestore';
import { Employee } from "../data/type";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);

export const listEmployees = async (): Promise<Record<string, Employee> | undefined> => {
    const EmployeesRef = ref(realtime, '/work/employee');
    const snapshot = await get(EmployeesRef);
    if (!snapshot.exists()) return undefined;
    return snapshot.val();
}

export const addEmployees = async (employee: Employee): Promise<void> => {
    const EmployeesRef = ref(realtime, '/work/employee');
    const newEmployeeRef = push(EmployeesRef);
    await set(newEmployeeRef, employee);
}

export const updateEmployees = async (employeeId: string, partialEmployee: Partial<Employee>): Promise<void> => {
    const employeeRef = ref(realtime, `/work/employee/${employeeId}`);
    await update(employeeRef, partialEmployee);
}
