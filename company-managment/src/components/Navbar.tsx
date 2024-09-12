import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import { useEffect } from 'react';



const Navbar = () => {
    const navigate = useNavigate();
    const { user, role, logout } = useAuth();

    const handleLogout = () => {
        logout().then(() => {
            navigate('/login');
        })
    }

    useEffect(() => {

        if (role === "admin") {
            navigate("/order-list")
        } else {
            navigate("/home")
        }
    }, [user, role, navigate]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CompanyManagement
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {user ? (
                            <>

                                {role === "user" && (
                                    <>

                                        <Button color="inherit" onClick={() => navigate("/my-orders")}>My Orders</Button>
                                        <Button color="inherit" onClick={() => navigate("/order-form")}>Contact Us</Button>
                                    </>
                                )}


                                {role === "admin" && (
                                    <>
                                        <Button color="inherit" onClick={() => navigate("/employees-list")}>Employees</Button>
                                        <Button color="inherit" onClick={() => navigate("/order-list")}>Orders</Button>
                                    </>
                                )}


                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                                <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;