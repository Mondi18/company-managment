import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { get, getDatabase, ref, set, push, update, remove } from "firebase/database";
import { CustomerUser, UserRole } from "../data/type";

import {
    collection,
    addDoc,
    doc,
    getDocs,
    getFirestore,
    getDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    arrayUnion
} from 'firebase/firestore';
import { Employee, Order } from "../data/type";
import { GoogleAuthProvider } from "firebase/auth"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app);
const provider = new GoogleAuthProvider();

export const loginPopup = async () => {
    console.log('::loginPopup');

    const { user } = await signInWithPopup(auth, provider);
    console.log(user);

    const document = await getDoc(doc(db, 'users', user.uid));
    console.log(document);

    if (!document.exists() && user) {
        const userRef = doc(db, 'users', user.uid);

        const newCustomerUser: CustomerUser = {
            uid: user.uid,
            email: user.email || '',
            role: UserRole.USER
        };
        await setDoc(userRef, newCustomerUser);
        console.log('!!! We have user !!!');
    }
};

export const logout = () => signOut(auth);

export const onAuthStateChangeListener = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
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

// User Register , Login, Logput with email and password

export const registerUser = async (email: string, password: string): Promise<void> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, 'users', user.uid);
        const customerUser: CustomerUser = {
            uid: user.uid,
            email: user.email || '',
            role: UserRole.USER
        };
        await setDoc(userRef, customerUser);
        console.log('User registering was successfully!')

    } catch (error) {
        console.error('Error registering user:', error);
    }
}

export const loginUser = async (email: string, password: string): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in');
    } catch (error) {
        console.error('Error signin in:', error);
    }
}

export const assignEmployeeToOrder = async (orderId: string, employeeId: string): Promise<void> => {
    try {
        const orderRef = doc(db, 'order', orderId);
        const employeeRef = ref(realtime, `/work/employee/${employeeId}`);

        // Ellenőrizzük, hogy létezik-e az alkalmazott
        const employeeSnap = await get(employeeRef);
        if (!employeeSnap.exists()) {
            throw new Error(`Employee with ID ${employeeId} does not exist`);
        }

        // Frissítjük a rendelést
        await updateDoc(orderRef, {
            employeeid: arrayUnion(employeeId)
        });

        // Frissítjük az alkalmazottat
        await update(employeeRef, {
            ordersid: arrayUnion(orderId)
        });

        console.log(`Employee ${employeeId} assigned to order ${orderId}`);
    } catch (error) {
        console.error('Error assigning employee to order:', error);
        throw error;
    }
}
