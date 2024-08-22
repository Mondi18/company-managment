import { useState, useEffect } from 'react'
import { loginUser, logoutUser, onAuthStateChangeListener, auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { Button, TextField } from '@mui/material';



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
    const handleLogin = async () => {
        try {
            await loginUser(email, password);
            console.log('Login successful!');
        } catch (error) {
            console.log('Login failed. Check the console for details.');
            console.error('Login error:', error);
        }
    };
    const handleLogout = async () => {
        try {
            await logoutUser();
            console.log("Log out is successfully!");

        } catch (error) {
            console.log('Logout failed. Check the console for details.');
            console.error('Logout error:', error);
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log('Login with Google successful!');
        } catch (error) {
            console.log('Login with Google failed. Check the console for details.');
            console.error('Google Sign-In error:', error);
        }
    };

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
                    <Button onClick={handleLogin} variant="contained">Login</Button>
                    <hr />
                    <Button variant="contained" onClick={handleGoogleSignIn}>Login with Google</Button>
                </>
            ) : (
                <>
                    <p>Welcome, {user.email}</p>
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                </>
            )}
        </div>
    );
};

export default Login;
