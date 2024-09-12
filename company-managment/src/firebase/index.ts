import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { get, getDatabase, ref, set, push, update, remove } from "firebase/database";
import { CustomerUser, UserRole } from "../data/type";
import { Timestamp } from "firebase/firestore";

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
    arrayUnion,
    arrayRemove
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

export const logout = async (): Promise<void> => {
    try {
        signOut(auth);
        console.log('User signed out');

    } catch (error) {
        console.error('Error signing out:', error);
    }
}

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

export const addOrder = async (order: Order, userId: string): Promise<Order> => {
    try {

        const UserDocRef = doc(db, 'users', userId);
        const UserDoc = await getDoc(UserDocRef);

        if (!UserDoc.exists()) {
            throw new Error('CustomerUser not found');
        }

        const customerUser = UserDoc.data() as CustomerUser;


        const newOrder: Order = {
            ...order,
            userId: customerUser.uid
        };


        const OrderRef = collection(db, 'order');
        const OrderDoc = await addDoc(OrderRef, newOrder);

        const newOrderId = OrderDoc.id;

        await updateDoc(UserDocRef, {
            ordersid: arrayUnion(newOrderId) // Add the order id to the user's ordersid array
        });

        return { ...newOrder, id: newOrderId };

        return newOrder;
    } catch (error) {
        console.error("Error adding order:", error);
        throw error; // Re-throw the error to be handled in the caller
    }
};

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
    const orderRef = doc(db, 'order', orderId);
    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) return undefined;

    const orderData = snapshot.data();

    return {
        ...orderData,
        deadline: (orderData?.deadline instanceof Timestamp)
            ? orderData.deadline.toDate()
            : orderData?.deadline
    } as Order;
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
        console.log(employeeId, orderId)

        // Fetch the employee data
        const employeeSnap = await get(employeeRef);
        if (!employeeSnap.exists()) {
            throw new Error(`Employee with ID ${employeeId} does not exist`);
        }
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
            throw new Error(`Order with ID ${orderId} does not exist`);
        }
        const employeeData = employeeSnap.val();

        await updateDoc(orderRef, {
            employeeid: arrayUnion(employeeId),
            Employees: arrayUnion(employeeData)
        });


        await update(employeeRef, {
            ordersid: arrayUnion(orderId),
        });

        console.log(`Employee ${employeeId} assigned to order ${orderId}`);
    } catch (error) {
        console.error('Error assigning employee to order:', error);
        throw error;
    }
}
export const deleteEmployeeFromOrder = async (orderId: string, employeeId: string): Promise<void> => {
    try {
        const orderRef = doc(db, 'order', orderId);
        const employeeRef = ref(realtime, `/work/employee/${employeeId}`);
        console.log(employeeId, orderId)

        // Fetch the employee data
        const employeeSnap = await get(employeeRef);
        if (!employeeSnap.exists()) {
            throw new Error(`Employee with ID ${employeeId} does not exist`);
        }
        const employeeData = employeeSnap.val();
        console.log('Fetched employee data:', employeeData);

        // Fetch the order data
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
            throw new Error(`Order with ID ${orderId} does not exist`);
        }
        const orderData = orderSnap.data();
        console.log('Fetched order data:', orderData);


        if (orderData) {
            // Filter out the employee from the Employees array by email
            const updatedEmployees = orderData.Employees?.filter((emp: { email: string }) => emp.email !== employeeData.email) || [];

            // Update the order document
            await updateDoc(orderRef, {
                employeeid: arrayRemove(employeeId), // Ensure you remove the employee ID
                Employees: updatedEmployees // Set the filtered array
            });
        }


        await update(employeeRef, {
            ordersid: arrayRemove(orderId),
        });

        console.log(`Employee ${employeeId} deleted from order ${orderId}`);
    } catch (error) {
        console.error('Error deleting employee from order:', error);
        throw error;
    }
}