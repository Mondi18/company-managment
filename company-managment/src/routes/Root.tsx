import { create, props } from '@stylexjs/stylex';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../auth/auth-provider';
import Navbar from '../components/Navbar';

const ROOT_STYLES = create({
    container: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        minHeight: '100vh',
    },
});

const Root: React.FC = () => (
    <AuthProvider>
        <div {...props(ROOT_STYLES.container)}>
            <Navbar />
            <Outlet />
        </div>
    </AuthProvider>
);

export default Root;
