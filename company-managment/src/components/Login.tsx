import { create, props } from '@stylexjs/stylex';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/index';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom'


const LOGIN_STYLES = create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        padding: '1rem',
        backgroundColor: '#cfe6e8',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'gray',
        borderRadius: '1rem',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    input: {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle inner shadow for depth
    },
    inputError: {
        border: '1px solid red', // Highlight input with error
    },
    button: {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    googleButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        backgroundColor: '#4285f4',
        color: 'white',
        padding: '1rem',
        width: '100%',
        border: 'none',
        borderRadius: '5px',
        marginTop: '1rem',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for Google button
    },
    googleIcon: {
        fontSize: '1.5rem',
    },
    errorMessage: {
        color: 'red',
        marginTop: '1rem',
        fontSize: '0.9rem',
    },
    registerPrompt: {
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#333',
    },
    registerLink: {
        color: '#4285f4',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    h1: {
        color: 'white'
    }
});
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [inputError, setInputError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const onLoginWithEmail = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {
            setError((error as Error).message || 'Invalid email or password');
            setInputError(true);
        }
    };


    const onLogin = () => {
        loginWithGoogle().then(() => {
            navigate('/employees-edit');
        });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setInputError(false);
        setError('');
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setInputError(false);
        setError("");
    }

    return (
        <main {...props(LOGIN_STYLES.container)}>

            <div {...props(LOGIN_STYLES.formContainer)}>
                <h1 {...props(LOGIN_STYLES.h1)}>Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    {...props(LOGIN_STYLES.input, inputError && LOGIN_STYLES.inputError)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    {...props(LOGIN_STYLES.input, inputError && LOGIN_STYLES.inputError)}
                />
                <button onClick={onLoginWithEmail} {...props(LOGIN_STYLES.button)}>
                    Login with Email
                </button>
                <button onClick={onLogin} {...props(LOGIN_STYLES.googleButton)}>
                    <div>Login with Google</div>
                    <GoogleIcon {...props(LOGIN_STYLES.googleIcon)} />
                </button>
                <div {...props(LOGIN_STYLES.registerPrompt)}>
                    <p{...props(LOGIN_STYLES.h1)}>If you don't have an account:</p>
                    <Link to="/register" {...props(LOGIN_STYLES.registerLink)}>REGISTER</Link>
                </div>
                {error && <div {...props(LOGIN_STYLES.errorMessage)}>{error}</div>}
            </div>
        </main>
    );
};

export default Login;