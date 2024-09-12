import React, { useState } from 'react';
import { registerUser } from '../firebase';
import { create, props } from '@stylexjs/stylex'
import { useNavigate } from 'react-router-dom';

const STYLES = create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh', // Full viewport height
        padding: '2rem',
        backgroundColor: '#e0f7fa', // Light background (similar to the login form's container background)
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: '#6e6e6e', // Dark gray background for the form container
        borderRadius: '12px', // Rounded corners
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
        margin: '0 auto', // Center the form horizontally
    },
    formTitle: {
        fontSize: '1.5rem',
        color: '#fff', // White text for the form title
        marginBottom: '1rem',
    },
    formGroup: {
        width: '100%',
        marginBottom: '1rem', // Space between form fields
    },
    input: {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        boxSizing: 'border-box',
        backgroundColor: '#fff', // White background for input fields
        outline: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow inside input fields
        marginBottom: '0.5rem', // Space below input fields
    },
    inputError: {
        border: '1px solid red', // Red border for error state
    },
    button: {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
        backgroundColor: '#007bff', // Blue color similar to the "Login with Email" button
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'background-color 0.3s ease',
        marginBottom: '1rem', // Space below the button
        ':hover': {
            backgroundColor: '#0056b3',
        },
    },
    h1: {
        color: 'white'
    },
    errorMessage: {
        color: 'white',
        fontSize: '0.875rem',
        margin: '0.5rem 0 0',
    }
});


const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // Email változásának kezelése
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailError(null);
    };

    // Jelszó változásának kezelése
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordError(null);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError(null);
    };


    // Form elküldésének kezelése
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        let hasError = false;

        if (!email) {
            setEmailError('Email is required');
            hasError = true;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            hasError = true;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(true);
        try {
            await registerUser(email, password);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div {...props(STYLES.container)}>

            <form onSubmit={handleSubmit} {...props(STYLES.form)}>
                <h1{...props(STYLES.h1)}>Register</h1>
                <div {...props(STYLES.formGroup)}>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        {...props(STYLES.input, emailError ? STYLES.inputError : {})}
                    />
                    {emailError && <p {...props(STYLES.errorMessage)}>{emailError}</p>}
                </div>
                <div {...props(STYLES.formGroup)}>
                    <input
                        type="password"
                        placeholder='Password'
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        {...props(STYLES.input, passwordError ? STYLES.inputError : {})}
                    />
                    {passwordError && <p {...props(STYLES.errorMessage)}>{passwordError}</p>}
                </div>
                <div {...props(STYLES.formGroup)}>
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        {...props(STYLES.input, confirmPasswordError ? STYLES.inputError : {})}
                    />
                    {confirmPasswordError && <p {...props(STYLES.errorMessage)}>{confirmPasswordError}</p>}
                </div>
                {error && <p {...props(STYLES.errorMessage)}>{error}</p>}
                <button type="submit" disabled={loading} {...props(STYLES.button)}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    )
};

export default Register;