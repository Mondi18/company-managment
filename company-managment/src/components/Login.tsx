import { useState, useEffect } from 'react'
import { loginUser, logoutUser, signInWithGoogle, onAuthStateChangeListener } from '../firebase';
import { User } from 'firebase/auth';



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
            await signInWithGoogle();
            console.log("nagyon mennőő")
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
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    <hr />
                    <button onClick={handleGoogleSignIn}>Login with Google</button>
                </>
            ) : (
                <>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
};

export default Login;
