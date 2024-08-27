import { useState, useEffect } from 'react';
import { listOrders, listEmployees, assignEmployeeToOrder } from '../firebase';
import { Order, WebStatus } from "../data/type";
import { Table, Button, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { props, create } from "@stylexjs/stylex";
import { Timestamp } from 'firebase/firestore';
import { Employee } from '../data/type';

const styles = create({
    headerCell: {
        width: '14.2857%',
        textAlign: 'center',
        border: '1px solid #ddd',
        padding: '8px',
    },
    tableCell: {
        textAlign: 'center',
        border: '1px solid #ddd',
        padding: '8px',
    },
    tr: {
        cursor: "pointer"
    },
    bg: {
        backgroundColor: 'bisque'
    },
    button: {
        margin: '0.5rem',
        color: 'red'
    }
});

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            const employeesData = await listEmployees();
            if (employeesData) {
                const formattedEmployees = Object.entries(employeesData).map(([id, employee]) => ({
                    ...employee,
                    id
                }));
                setEmployees(formattedEmployees);
                console.log(formattedEmployees);
            } else {
                setEmployees([]);
            }
        }
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersData = await listOrders();
            if (ordersData) {
                const formattedOrders = Object.entries(ordersData).map(([id, order]) => ({
                    ...order,
                    id
                }));
                setOrders(formattedOrders);
                console.log(formattedOrders);
            } else {
                setOrders([]);
            }
        };
        fetchOrders();
    }, []);

    const formatDeadline = (deadline: Timestamp | Date) => {
        const date = deadline instanceof Timestamp ? deadline.toDate() : deadline;
        return date.toLocaleDateString('hu-HU');
    };

    const handleOpenOrderDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };
    const handleAssignEmployee = () => {
        if (selectedEmployee && selectedOrder) {
            assignEmployeeToOrder(selectedOrder.id, selectedEmployee.id);

            handleCloseOrderDetails();
        }
    };



    const getStatusText = (status: WebStatus): string => {
        switch (status) {
            case WebStatus.Processing:
                return 'Feldolgozás alatt';
            case WebStatus.InProgress:
                return 'Folyamatban';
            case WebStatus.Completed:
                return 'Befejezve';
            default:
                return 'Ismeretlen';
        }
    };

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th {...props(styles.headerCell)}>Web</th>
                        <th {...props(styles.headerCell)}>Pages</th>
                        <th {...props(styles.headerCell)}>Style</th>
                        <th {...props(styles.headerCell)}>Service</th>
                        <th {...props(styles.headerCell)}>Deadline</th>
                        <th {...props(styles.headerCell)}>Notice</th>
                        <th {...props(styles.headerCell)}>Status</th>
                        <th {...props(styles.headerCell)}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td {...props(styles.tableCell)}>{order.web || "Ismeretlen"}</td>
                            <td {...props(styles.tableCell)}>{order.pages}</td>
                            <td {...props(styles.tableCell)}>{order.style}</td>
                            <td {...props(styles.tableCell)}>{order.service ? 'Igen' : 'Nem'}</td>
                            <td {...props(styles.tableCell)}>{formatDeadline(order.deadline)}</td>
                            <td {...props(styles.tableCell)}>{order.notice}</td>
                            <td {...props(styles.tableCell)}>{getStatusText(order.status)}</td>
                            <td {...props(styles.tableCell)}>{order.price}</td>
                            <td {...props(styles.tableCell)}>
                                {order.employeeid && order.employeeid.length > 0 ? (
                                    order.employeeid.map((emp, i) => (
                                        <p key={i}>{emp}</p>
                                    ))
                                ) : (
                                    'Nincs hozzárendelve'
                                )}
                            </td>
                            <td><Button onClick={() => handleOpenOrderDetails(order)}>See the order</Button></td>
                            <Dialog open={!!selectedOrder} onClose={handleCloseOrderDetails}>
                                <DialogTitle>Rendelés részletei</DialogTitle>
                                <DialogContent>
                                    {selectedOrder && (
                                        <>
                                            <p>ID: {selectedOrder.id}</p>
                                            <p>Ár: {selectedOrder.price}</p>
                                            {/* Add more order details here */}
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Alkalmazott hozzárendelése</InputLabel>
                                                <Select
                                                    value={selectedEmployee ? selectedEmployee.id : ''}
                                                    onChange={(e) => {
                                                        const employeeId = e.target.value as string;
                                                        const employee = employees?.find(emp => emp.id === employeeId) || null;
                                                        setSelectedEmployee(employee);
                                                    }}
                                                >
                                                    {employees && employees.map((employee) => (
                                                        <MenuItem key={employee.id} value={employee.id}>
                                                            {employee.lastName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleAssignEmployee} disabled={!selectedEmployee}>
                                        Alkalmazott hozzárendelése
                                    </Button>
                                    <Button onClick={handleCloseOrderDetails}>Bezárás</Button>
                                </DialogActions>
                            </Dialog>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </div >
    );
};

export default OrderList;