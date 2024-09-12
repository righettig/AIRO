import { FC, useState } from 'react';
import { login } from '@/app/common/auth.service';

import styles from './login.module.css';

const Login: FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState('admin@anybotics.com');
    const [password, setPassword] = useState('q1w2e3');

    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.token);
            onLogin();
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            {error && <div className={styles.error}>{error}</div>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.inputField}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
            />
            <button onClick={handleLogin} className={styles.loginButton} disabled={!username || !password}>
                Login
            </button>
        </div>
    );
};

export default Login;
