import { useState, useEffect } from 'react';
import { listOrders } from '../firebase';
import { Order, WebStatus } from "../data/type";
import { Table, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { props, create } from "@stylexjs/stylex";
import { Timestamp } from 'firebase/firestore';
import { Web } from '../data/type';
import { WebStyle } from '../data/type';
import { useNavigate } from 'react-router-dom';
import useEmployees from '../hooks/useEmployees';


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
    const { employees } = useEmployees();
    const navigate = useNavigate();



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

    const handlegetOrderByIdOrder = (order: Order) => {
        navigate(`/order-details/${order.id}`);
    };



    const getStatusText = (status: WebStatus): string => {
        switch (status) {
            case WebStatus.Processing:
                return 'Processing';
            case WebStatus.InProgress:
                return 'InProgress';
            case WebStatus.Completed:
                return 'Completed';
            default:
                return 'Unknown';
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
                            <td {...props(styles.tableCell)}>{order.price} $</td>
                            <td {...props(styles.tableCell)}>
                                {order.Employees ? (
                                    order.Employees.map(employee => (
                                        <div key={employee.id}>{employee.jobPosition}</div>
                                    ))
                                ) : (
                                    'No Employees'
                                )}
                            </td>
                            <td><Button onClick={() => handleOpenOrderDetails(order)}>See the order</Button></td>
                            <td><Button onClick={() => handlegetOrderByIdOrder(order)}>Update</Button></td>

                            <Dialog open={!!selectedOrder} onClose={handleCloseOrderDetails}>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogContent>

                                    {selectedOrder && (
                                        <>
                                            <p>ID: {selectedOrder.id}</p>
                                            <p>Price: {selectedOrder.price} $</p>
                                            <p>Application: {getWebText(selectedOrder.web)}</p>
                                            <p>Pages: {selectedOrder.pages}</p>
                                            <p>Style: {getWebStyleText(selectedOrder.style)}</p>
                                            <p>Service: {selectedOrder.service ? "Yes" : "No"}</p>
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
                                                            <span>{employee.firstName}</span>

                                                        </div>
                                                    ))
                                                    : <div>
                                                        No employees yet
                                                    </div>}
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                                <DialogActions>
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