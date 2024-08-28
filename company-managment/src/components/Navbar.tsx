import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

import { create, props } from '@stylexjs/stylex';

const styles = create({
    sidebar: {
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#3f51b5',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000, // Ensure the sidebar is on top
        fontSize:'20px',
    },
    sidebarAppbar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'inherit',
        boxShadow: 'none',
    },
    sidebarToolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
    },
    sidebarTitle: {
        marginBottom: '16px',
        color: 'white',
    },
    sidebarButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '55px',
    },
    button: {
        justifyContent: 'flex-start',
        color: 'white',
        cursor: 'pointer',
    },
    logout:{
        marginTop:'35px',
        cursor: 'pointer',
   
    }
});

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <Box {...props(styles.sidebar)}>
            <AppBar position="static" {...props(styles.sidebarAppbar)}>
                <Toolbar {...props(styles.sidebarToolbar)}>
                    <Typography variant="h6" {...props(styles.sidebarTitle)}>
                        CompanyManagment
                    </Typography>
                    <Box {...props(styles.sidebarButtons)}>
                        {user ? (
                            <div {...props(styles.logout)} onClick={handleLogout}>
                                Logout
                            </div>
                        ) : (
                            <div {...props(styles.button)} onClick={() => navigate('/login')}>
                                Login
                            </div>
                        )}
                        <div {...props(styles.button)} onClick={() => navigate('employees-list')}>
                            Employees
                        </div>
                        <div {...props(styles.button)} onClick={()=>navigate('order-list')}>
                            Orders
                        </div>
                        <div {...props(styles.button)} onClick={()=>navigate('home')}>
                                Home
                            </div>
                        <div {...props(styles.button)} onClick={() => navigate('order-form')}>
                            Contact
                        </div>
                        
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;