import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, set, push, update, remove } from "firebase/database";

import {
    collection,
    addDoc,
    doc,
    getDocs,
    getFirestore,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { Employee, Order } from "../data/type";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);

//employee CRUD operations

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
    const EmployeeRef = ref(realtime, `/work/employee/${employeeId}`);
    await update(EmployeeRef, partialEmployee);
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
    const EmployeeRef = ref(realtime, `/work/employee/${employeeId}`);
    await remove(EmployeeRef);
}

//Order CRUD operations

export const addOrder = async (order: Order): Promise<Order> => {
    const OrderRef = collection(db, 'order');
    await addDoc(OrderRef, order);
    return order;
}

export const listOrders = async (): Promise<Record<string, Order> | undefined> => {
    const OrderRef = collection(db, 'order');
    const snapshot = await getDocs(OrderRef);
    if (snapshot.empty) {
        return undefined;
    }

    const orders: Record<string, Order> = {};
    snapshot.forEach(doc => {
        orders[doc.id] = doc.data() as Order;
    })
    return orders;
}

export const getOrderById = async (orderId: string): Promise<Order | undefined> => {
    const OrderRef = doc(db, 'order', orderId);
    const snapshot = await getDoc(OrderRef);
    if (!snapshot.exists()) return undefined;
    return snapshot.data() as Order;
}

export const updateOrder = async (orderId: string, partialOrder: Partial<Order>): Promise<void> => {
    const OrderRef = doc(db, 'order', orderId);
    try {
        await updateDoc(OrderRef, partialOrder);
    } catch (error) {
        console.error("Error deleting document :", error)
    }
}

export const deleteOrder = async (orderId: string): Promise<void> => {
    const OrderRef = doc(db, 'order', orderId);
    try {
        await deleteDoc(OrderRef);
    } catch (error) {
        console.error("Error deleting document :", error)
    }
}
