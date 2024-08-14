import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, set, push, update } from "firebase/database";

import {
    getFirestore,
} from 'firebase/firestore';
import { Employee, JobPosition, Level } from '../data/type';
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

export const addEmployees = async (employee: Employee): Promise<void> => {
    const EmployeesRef = ref(realtime, '/work/employee');
    const newEmployeeRef = push(EmployeesRef);
    await set(newEmployeeRef, employee);
}

export const updateEmployees = async (employeeId: string, partialEmployee: Partial<Employee>): Promise<void> => {
    const employeeRef = ref(realtime, `/work/employee/${employeeId}`);
    await update(employeeRef, partialEmployee);
}
const newEmployee: Employee = {
    firstName: "András",
    lastName: "Tóth",
    email: "andras.toth@example.com",
    level: Level.Senior,
    jobPosition: JobPosition.SystemAdministrator,
    salary: 100,
    isBusy: false
}

addEmployees(newEmployee)
    .then(() => console.log("Employee added successfully!"))
    .catch((error) => console.error("Error adding employee :", error))


const Id = "-O4FuQhgHk5tOAIHhXuB";
const updatedEmployeeData: Partial<Employee> = {
    salary: 1000,
    isBusy: true
}

updateEmployees(Id, updatedEmployeeData)
    .then(() => console.log("Employee updated successfully!"))
    .catch((error) => console.error("Error updating employee: ", error));