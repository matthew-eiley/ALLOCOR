import { useState, useEffect } from 'react';
import './styles.scss';

export default function Register({ onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [notification, setNotification] = useState({
        message: '',
        type: '' // 'success' or 'error'
    });

    // Clear notification after 5 seconds
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.message]);

    // Get users from localStorage
    const getUsers = () => {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    };

    // Check if email already exists in localStorage
    const isEmailTaken = (email) => {
        const users = getUsers();
        return users.some(user => user.email === email);
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        // Username validation
        if (!formData.username.trim()) {
            tempErrors.username = 'Username is required';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }

        // Password validation (enforce the UI rules: 8-15 chars, mixed case, number)
        const pwd = formData.password || '';
        if (!pwd) {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else {
            if (pwd.length < 8 || pwd.length > 15) {
                tempErrors.password = 'Password must be 8 to 15 characters long';
                isValid = false;
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])/.test(pwd)) {
                tempErrors.password = (tempErrors.password ? tempErrors.password + ' ' : '') + 'Password must contain both lowercase and uppercase letters';
                isValid = false;
            }
            if (!/\d/.test(pwd)) {
                tempErrors.password = (tempErrors.password ? tempErrors.password + ' ' : '') + 'Password must contain at least one number';
                isValid = false;
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            tempErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.confirmPassword !== formData.password) {
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Persist errors to state for inline UI, but also return them so callers don't rely on async state updates
        setErrors(tempErrors);
        return { isValid, tempErrors };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { isValid, tempErrors } = validateForm();

        if (!isValid) {
            // Build notification from the errors we just computed
            const errorMessages = Object.values(tempErrors).filter(Boolean);
            setNotification({
                message: errorMessages.join(' • '),
                type: 'error'
            });
            return;
        }

        // Check if email is already taken
        if (isEmailTaken(formData.email)) {
            setNotification({ message: 'Email already exists.', type: 'error' });
            return;
        }

        try {
            // Get existing users
            const users = getUsers();
            
            // Add new user
            users.push({
                username: formData.username,
                email: formData.email,
                password: formData.password // Note: In a real app, you'd want to hash this
            });

            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Clear form and show success
            setNotification({ message: 'Registration successful!', type: 'success' });
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            setErrors({ username: '', email: '', password: '', confirmPassword: '' });

            // Navigate to home page after successful registration
            if (onRegisterSuccess) {
                onRegisterSuccess();
            }
        } catch (error) {
            setNotification({ message: 'Registration failed: Please try again later.', type: 'error' });
        }
    };

    return (
        <div className="register-container">
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="register-form" noValidate>
                <h2>Create Account</h2>
                
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? 'error' : ''}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        <div className="password-requirements">
                            <h4>Password Requirements:</h4>
                            <ul>
                                <li className={formData.password.length >= 8 && formData.password.length <= 15 ? 'valid' : ''}>
                                    Contains 8 to 15 characters
                                </li>
                                <li className={/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}>
                                    Contains both lower and uppercase letters
                                </li>
                                <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                                    Contains at least one number
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                </div>

                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
}