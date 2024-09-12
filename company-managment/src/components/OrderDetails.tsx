import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, assignEmployeeToOrder, deleteEmployeeFromOrder, updateOrder } from '../firebase';
import { Order, Employee, WebStyle } from '../data/type';
import { Tooltip, IconButton, Typography, Card, CardContent, CardHeader, Button, FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Checkbox } from '@mui/material';
import useEmployees from '../hooks/useEmployees';
import { WebStatus } from '../data/type';
import { Web } from '../data/type';
import { useNavigate } from 'react-router-dom';
import { create, props } from '@stylexjs/stylex';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const styles = create({
    container: {
        padding: '2rem 0',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#cfe6e8 !important'
    },
    card: {
        padding: '2rem',
        marginBottom: '2rem',
        color: 'black !important',
        borderRadius: '2rem !important'
    },
    formControl: {
        marginBottom: '1rem',
    },
    title: {
        marginBottom: '1rem',
    },
    button: {
        marginTop: '1rem',
    },
    list: {
        padding: '0',
        margin: '0',
        listStyleType: 'none',
    },
    listItem: {
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


});

const OrderDetails = () => {

    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>();
    const { employees, loading, error } = useEmployees();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeesUpdated, setEmployeesUpdated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderId) {
                const orderData = await getOrderById(orderId);
                setOrder(orderData || null);
                setEmployeesUpdated(false)
            }
        };

        fetchOrderDetails();
    }, [orderId, employeesUpdated]);

    const handleAssignEmployee = async () => {
        if (orderId && selectedEmployee?.id) {
            await assignEmployeeToOrder(orderId, selectedEmployee.id);
            const updatedOrder = { ...order, Employees: [...(order?.Employees || []), selectedEmployee] };
            setOrder(updatedOrder as Order);
            setEmployeesUpdated(true);
        }
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        console.log("Delete employye :", employeeId)
        if (orderId && employeeId) {
            await deleteEmployeeFromOrder(orderId, employeeId);
            setOrder(prevOrder => ({
                ...prevOrder!,
                Employees: prevOrder?.Employees?.filter(emp => emp.id !== employeeId) || []
            }));
            console.log("Employee deleted successfully");
            setEmployeesUpdated(true);
            navigate("/order-list");
        }
    };

    const handleUpdateOrder = async () => {
        if (order && orderId) {
            try {
                await updateOrder(orderId, order);
                console.log("Order is updated!");
                navigate("/order-list");
            } catch (e) {
                console.error(e);
            };
        }
    }
    const filteredEmployees = employees.filter(emp =>
        order?.employeeid?.includes(emp.id || '') || false
    );
    const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder(prev => prev ? { ...prev, service: event.target.checked } : null);
    };

    if (loading) {
        return <p>Loading employees...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (

        <div {...props(styles.container)}>
            {order ? (
                <div key={order.id}>
                    <Typography variant="h2" gutterBottom {...props(styles.title)}>
                        Order Details
                    </Typography>

                    <Card {...props(styles.card)}>
                        <CardHeader title="Order Information" />
                        <CardContent>
                            {/* Web */}
                            <FormControl fullWidth margin="normal" {...props(styles.formControl)}>
                                <InputLabel>Web</InputLabel>
                                <Select
                                    value={order.web}
                                    onChange={(e) => setOrder(prev => prev ? { ...prev, web: e.target.value as Web } : null)}
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

                            {/* WebStyle */}
                            <FormControl fullWidth margin="normal" {...props(styles.formControl)}>
                                <InputLabel>WebStyle</InputLabel>
                                <Select
                                    value={order.style}
                                    onChange={(e) => setOrder(prev => prev ? { ...prev, style: e.target.value as WebStyle } : null)}
                                >
                                    {Object.keys(WebStyle)
                                        .filter(key => isNaN(Number(key)))
                                        .map((key) => (
                                            <MenuItem key={key} value={WebStyle[key as keyof typeof WebStyle]}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {/* Pages */}
                            <TextField
                                label="Pages"
                                type="number"
                                value={order.pages || ''}
                                onChange={(e) => setOrder(prev => prev ? { ...prev, pages: parseInt(e.target.value) } : null)}
                                fullWidth
                                margin="normal"
                            />

                            {/* Price */}
                            <TextField
                                label="Price"
                                type="number"
                                value={order.price || ''}
                                onChange={(e) => setOrder(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                                fullWidth
                                margin="normal"
                            />

                            {/* Status */}
                            <FormControl fullWidth margin="normal" {...props(styles.formControl)}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={order.status}
                                    onChange={(e) => setOrder(prev => prev ? { ...prev, status: e.target.value as WebStatus } : null)}
                                >
                                    <MenuItem value={WebStatus.Processing}>Processing</MenuItem>
                                    <MenuItem value={WebStatus.InProgress}>In Progress</MenuItem>
                                    <MenuItem value={WebStatus.Completed}>Done</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Deadline */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Deadline"
                                type="date"
                                value={order.deadline instanceof Date && !isNaN(order.deadline.getTime())
                                    ? order.deadline.toISOString().substring(0, 10)
                                    : ''}
                                onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    if (!isNaN(date.getTime())) {
                                        setOrder(prev => prev ? { ...prev, deadline: date } : null);
                                    }
                                }}
                            />

                            {/* Notice */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Notice"
                                multiline
                                rows={4}
                                value={order.notice || ''}
                                onChange={(e) => setOrder(prev => prev ? { ...prev, notice: e.target.value } : null)}
                            />

                            <FormControl fullWidth margin="normal" {...props(styles.formControl)}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={order.service || false}
                                            onChange={handleServiceChange}
                                        />
                                    }
                                    label="Service"
                                />
                            </FormControl>
                            <Button onClick={handleUpdateOrder} disabled={!order} {...props(styles.button)}>
                                Update Order
                            </Button>
                        </CardContent>
                    </Card>

                    <Card {...props(styles.card)}>
                        <CardHeader title="Employees" />
                        <CardContent>
                            <ul {...props(styles.list)}>
                                {filteredEmployees.map(employee => (
                                    <li key={employee.id} {...props(styles.listItem)}>
                                        {employee.lastName}
                                        <Tooltip title="Delete Employee">
                                            <span>
                                                <IconButton onClick={() => handleDeleteEmployee(employee.id || '')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </li>
                                ))}
                            </ul>


                            <FormControl fullWidth margin="normal" {...props(styles.formControl)}>
                                <InputLabel>Add Employee</InputLabel>
                                <Select
                                    value={selectedEmployee ? selectedEmployee.id : ''}
                                    onChange={(e) => {
                                        const employeeId = e.target.value as string;
                                        const employee = employees.find(emp => emp.id === employeeId) || null;
                                        setSelectedEmployee(employee);
                                    }}
                                >
                                    {employees.map((employee) => (
                                        <MenuItem key={employee.id} value={employee.id}>
                                            {employee.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Tooltip title="Add Employee">
                                <span>
                                    <IconButton onClick={handleAssignEmployee} disabled={!selectedEmployee}>
                                        <AddIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </CardContent>
                    </Card>


                </div>
            ) : (
                <Typography variant="body1">Loading order details...</Typography>
            )}
        </div>
    );

};

export default OrderDetails;