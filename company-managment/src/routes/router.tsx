import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login"
import Home from "../components/Home";
import Root from "./Root";
import EmployeesEdit from "../employees/employees-edit";
import EmployeesList from "../employees/employees-list";
import OrderForm from "../orders/order-form";
import OrderList from "../orders/order-list";
import Register from "../components/Register";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Register />,
            },
            {
                path: '/home',
                element: <Home />
            },
            {
                path: 'reviews',
                element: <div>Hamarosan</div>,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {

                path: 'employees-edit',
                element: <EmployeesEdit />
            },
            {
                path: 'employees-list',
                element: <EmployeesList />
            },
            {

                path:'order-form',
                element: <OrderForm/>
            },
            {
                path: 'order-list',
                element: <OrderList />
            },
            {
                path: 'order-form',
                element: <OrderForm />
            }
        ],
    },
]);

export default router;