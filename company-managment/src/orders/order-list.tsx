import { useState, useEffect } from 'react';
import { listOrders } from '../firebase';
import { Order, WebStatus } from "../data/type";
import { Table } from '@mui/material';
import { props, create } from "@stylexjs/stylex";
import { Timestamp } from 'firebase/firestore';

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

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await listOrders();
            if (orders) {
                setOrders(Object.values(orders));

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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OrderList;