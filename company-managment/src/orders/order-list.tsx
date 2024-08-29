import { useState, useEffect } from 'react';
import { listOrders, listEmployees, assignEmployeeToOrder } from '../firebase';
import { Order, WebStatus } from "../data/type";
import { Table, Button, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { props, create } from "@stylexjs/stylex";
import { Timestamp } from 'firebase/firestore';
import { Employee } from '../data/type';
import { deleteEmployeeFromOrder } from '../firebase';

const styles = create({
    headerCell: {
        width: '8.2857%',
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

                formattedOrders.forEach(order => {
                    if (order.employeeid && employees) {
                        order.Employees = [];
                        order.employeeid.forEach(employeeId => {
                            const employee = employees.find(employee => employee.id === employeeId);
                            if (employee) {
                                order.Employees!.push(employee);
                            }
                        })
                    }
                })
                setOrders(formattedOrders);

            } else {
                setOrders([]);

            }
        };
        fetchOrders();
    }, [selectedOrder, employees]);

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
        if (selectedEmployee?.id && selectedOrder?.id) {
            assignEmployeeToOrder(selectedOrder.id, selectedEmployee.id);

            handleCloseOrderDetails();
        }
    };

    const handleDelete = async (orderId: string, employeeId: string) => {
        if (!orderId || !employeeId) {
            console.error('Invalid orderId or employeeId');
            return;
        }
        try {
            console.log(orderId, employeeId);
            await deleteEmployeeFromOrder(orderId, employeeId);
            // Update the local state after successful deletion
            setSelectedOrder(prevOrder => {
                if (prevOrder && prevOrder.id === orderId) {
                    return {
                        ...prevOrder,
                        Employees: prevOrder.Employees?.filter(emp => emp.id !== employeeId)
                    };
                }
                return prevOrder;
            });
            // Optionally, you can also update the orders state here if needed
        } catch (error) {
            console.error('Error deleting employee from order:', error);
            // Optionally, you can show an error message to the user here
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
                        <th {...props(styles.headerCell)}>Employee</th>
                        <th {...props(styles.headerCell)}>View</th>
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
                                {order.Employees ? (
                                    order.Employees.map(employee => (
                                        <div key={employee.id}>{employee.jobPosition}</div>
                                    ))
                                ) : (
                                    'Nincs hozzárendelve'
                                )}
                            </td>
                            <td><Button onClick={() => handleOpenOrderDetails(order)}>See the order</Button></td>
                            <Dialog open={!!selectedOrder} onClose={handleCloseOrderDetails}>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogContent>

                                    {selectedOrder && (
                                        <>
                                            <p>ID: {selectedOrder.id}</p>
                                            <p>Ár: {selectedOrder.price}</p>
                                            <p>Pages: {selectedOrder.pages}</p>
                                            <p>Style: {selectedOrder.style}</p>
                                            <p>Service: {selectedOrder.service}</p>
                                            <p>Deadline: {formatDeadline(selectedOrder.deadline)}</p>
                                            <p>Notice: {selectedOrder.notice}</p>
                                            <p>Status: {getStatusText(selectedOrder.status)}</p>
                                            <div>
                                                <strong>Employees:</strong>
                                                {selectedOrder.Employees ?
                                                    selectedOrder.Employees.map(employee => (
                                                        <div key={employee.id} style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '5px'
                                                        }}>
                                                            <span>{employee.lastName}</span>
                                                            <button onClick={() => selectedOrder.id && employee.id && handleDelete(selectedOrder.id, employee.id)}>Delete</button>
                                                        </div>
                                                    ))
                                                    : 'Nincs hozzárendelve'}
                                            </div>

                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Add Employee</InputLabel>
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
                                        Add Employee
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