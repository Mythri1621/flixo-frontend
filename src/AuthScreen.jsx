```jsx
import { useState } from 'react';

const API_URL = 'https://flixo-backend-1.onrender.com/api/auth';

export default function AuthScreen({ onSuccess }) {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${isSignup ? 'signup' : 'login'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            isSignup
              ? { username, email, password }
              : { email, password }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setMessage(data.message || 'Success!');
      setMessageType('success');

      if (typeof onSuccess === 'function') {
        onSuccess(data);
      }
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to FLIXO server. Please try again.'
          : error.message
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsSignup(!isSignup);
    setMessage('');
    setMessageType('');
    setPassword('');
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">FLIXO</div>

        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>

        <p className="auth-subtitle">
          {isSignup
            ? 'Create an account and start exploring.'
            : 'Log in to continue watching your favourites.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              maxLength={100}
              autoComplete="username"
            />
          )}

          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={150}
            autoComplete="email"
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        {message && (
          <div
            className={`auth-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <p className="auth-switch">
          {isSignup
            ? 'Already have an account? '
            : "Don't have an account? "}
          <button type="button" onClick={switchMode}>
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </section>
    </main>
  );
}
```