
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';



const Root: React.FC = () => (

    <div>
        <Navbar />
        <Outlet />
    </div>

);

export default Root;