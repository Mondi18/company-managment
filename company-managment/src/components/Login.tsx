import { useState, useEffect } from 'react'
import { onAuthStateChangeListener } from '../firebase';
import { User } from 'firebase/auth';
import { Button, TextField } from '@mui/material';
import { logout } from '../firebase';
import { signInWithGoogle } from '../firebase';
import { loginUser } from '../firebase';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangeListener((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2>Login</h2>
            {!user ? (
                <>
                    <TextField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size='small'
                    />
                    <TextField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size='small'
                    />
                    <Button variant="contained" onClick={() => loginUser(email, password)}>Login</Button>
                    <hr />
                    <Button variant="contained" onClick={signInWithGoogle}>Login with Google</Button>
                </>
            ) : (
                <>
                    <p>Welcome, {user.email}</p>
                    <Button variant="contained" onClick={logout}>Logout</Button>
                </>
            )}
        </div>
    );
};

export default Login;
