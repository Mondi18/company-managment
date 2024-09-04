import { useState, useEffect } from 'react';
import { listOrders, listEmployees, assignEmployeeToOrder } from '../firebase';
import { Order, WebStatus } from "../data/type";
import { Table, Button, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { props, create } from "@stylexjs/stylex";
import { Timestamp } from 'firebase/firestore';
import { Employee } from '../data/type';
import { Web } from '../data/type';
import { WebStyle } from '../data/type';
import { deleteEmployeeFromOrder } from '../firebase';
import { updateOrder } from '../firebase';


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
    const [editOrder, setEditOrder] = useState<Order | null>(null);


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
    }, [selectedOrder, employees, editOrder]);

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
    const handleSave = async () => {
        try {
            if (editOrder) {
                await updateOrder(editOrder.id!, editOrder);
                console.log('Order updated successfully');
                setEditOrder(null);
            }
            else {
                console.error('No order to update');
            }


        } catch (error) {
            console.error('Error updating order:', error);
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

    const handleOpenEditOrder = (order: Order) => {
        setEditOrder(order);
    };

    const handleCloseEditOrder = () => {
        setEditOrder(null);
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
    const getWebText = (web: Web): string => {
        switch (web) {
            case Web.Blog:
                return 'Bolg';
            case Web.Webshop:
                return 'Webshop';
            case Web.Portfolio:
                return 'Portfolio';
            case Web.SpecificApplication:
                return 'Specific Application';
            default:
                return 'Ismeretlen';
        }
    };

    const getWebStyleText = (style: WebStyle): string => {
        switch (style) {
            case WebStyle.Modern:
                return 'Modern';
            case WebStyle.MobileFirst:
                return 'Mobile First';
            case WebStyle.Traditional:
                return 'Traditional';
            case WebStyle.Minimalist:
                return 'Minimalist';
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
                        <th {...props(styles.headerCell)}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td {...props(styles.tableCell)}>{getWebText(order.web) || "Ismeretlen"}</td>
                            <td {...props(styles.tableCell)}>{order.pages}</td>
                            <td {...props(styles.tableCell)}>{getWebStyleText(order.style) || "Ismeretlen"}</td>
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
                            <td><Button onClick={() => handleOpenEditOrder(order)}>Update</Button></td>

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
                            <Dialog open={!!editOrder} onClose={handleCloseEditOrder}>
                                <DialogTitle>Edit Details</DialogTitle>
                                <DialogContent>

                                    {editOrder && (
                                        <div>
                                            {/* Web */}
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Web</InputLabel>
                                                <Select
                                                    value={editOrder?.web !== undefined ? editOrder.web : ''}
                                                    onChange={(e) => setEditOrder({ ...editOrder!, web: e.target.value as Web })}
                                                >
                                                    {Object.keys(Web)
                                                        .filter(key => isNaN(Number(key)))
                                                        .map((key) => (
                                                            <MenuItem key={key} value={Web[key as keyof typeof Web]}>
                                                                {key}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            {/* Pages mező */}
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                label="Pages"
                                                type="number"
                                                value={editOrder.pages.toString()}
                                                onChange={(e) => setEditOrder({ ...editOrder, pages: parseInt(e.target.value) })}
                                            />
                                            {/* Web Style */}
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Web Style</InputLabel>
                                                <Select
                                                    value={editOrder?.style !== undefined ? editOrder.style : ''}
                                                    onChange={(e) => setEditOrder({ ...editOrder!, style: e.target.value as WebStyle })}
                                                >
                                                    {Object.keys(WebStyle)
                                                        .filter(key => isNaN(Number(key))) // Only get the string keys, not the enum values
                                                        .map((key) => (
                                                            <MenuItem key={key} value={WebStyle[key as keyof typeof WebStyle]}>
                                                                {key}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            {/* Service */}
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Service</InputLabel>
                                                <Select
                                                    value={editOrder?.service !== undefined ? editOrder.service.toString() : ''}
                                                    onChange={(e) => setEditOrder({ ...editOrder!, service: e.target.value === 'true' })}
                                                >
                                                    <MenuItem value="true">Igen</MenuItem>
                                                    <MenuItem value="false">Nem</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {/* Deadline mező */}
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                label="Deadline"
                                                type="date"
                                                value={editOrder.deadline instanceof Date && !isNaN(editOrder.deadline.getTime())
                                                    ? editOrder.deadline.toISOString().substring(0, 10)
                                                    : ''}
                                                onChange={(e) => {
                                                    const date = new Date(e.target.value);
                                                    if (!isNaN(date.getTime())) {
                                                        setEditOrder({ ...editOrder, deadline: date });
                                                    }
                                                }}
                                            />
                                            {/* Notice mező */}
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                label="Notice"
                                                multiline
                                                rows={4}
                                                value={editOrder.notice}
                                                onChange={(e) => setEditOrder({ ...editOrder, notice: e.target.value })}
                                            />
                                            {/* Status */}
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={editOrder?.status !== undefined ? editOrder.status.toString() : ''}
                                                    onChange={(e) => setEditOrder({ ...editOrder!, status: parseInt(e.target.value) as WebStatus })}
                                                >
                                                    {Object.keys(WebStatus)
                                                        .filter(key => isNaN(Number(key))) // Only get the string keys, not the enum values
                                                        .map((key) => (
                                                            <MenuItem key={key} value={WebStatus[key as keyof typeof WebStatus]}>
                                                                {key}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            {/* Price mező */}
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                label="Price"
                                                type="number"
                                                value={editOrder.price.toString()}
                                                onChange={(e) => setEditOrder({ ...editOrder, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleSave} disabled={!updateOrder}>
                                        Update Order
                                    </Button>
                                    <Button onClick={handleCloseOrderDetails}>Close</Button>
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