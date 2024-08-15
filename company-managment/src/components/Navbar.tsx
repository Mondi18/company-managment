import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CompanyManagment
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate("")}>Login</Button> 
                        <Button color="inherit" onClick={() => navigate("employees-list")}>Employees</Button>
                        <Button color="inherit" onClick={() => navigate("home")}>Home</Button>
                        <Button color="inherit" onClick={() => navigate("")}>Logout</Button>
                        <Button color="inherit" onClick={() => navigate("order-form")}>Contact</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
