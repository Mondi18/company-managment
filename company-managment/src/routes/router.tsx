import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login"
import Home from "../components/Home";
import Root from "./Root";
import Order from "../components/Order";
import EmployeesEdit from "../employees/employees-edit";
import EmployeesList from "../employees/employees-list";
const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Login />,
            },
            {
                path: '/home',
                element: (

                    <Home />

                ),
            },
            {
                path: '/order',
                element: (

                    <Order />

                ),
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

                path:'employees-edit',
                element:<EmployeesEdit/>
            },
            {
                path:'employees-list',
                element: <EmployeesList/>
            },
        ],
    },
]);

export default router;