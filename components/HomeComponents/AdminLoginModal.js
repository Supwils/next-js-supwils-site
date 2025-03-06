import { useState } from 'react';
import styles from './AdminLoginModal.module.css';
import { useRouter } from 'next/router';

const AdminLoginModal = ({ onClose }) =>
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setLoading(true);
    setError('');

    try
    {
      // Call the authentication API
      const response = await fetch('/api/auth/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success)
      {
        // No need to store in localStorage anymore
        // We're using HTTP-only cookies now

        // Just close the modal and don't redirect
        // Set a flag that we can use to show the notification
        // This is done by dispatching a custom event
        window.dispatchEvent(new CustomEvent('loginSuccess'));

        // Close the modal
        onClose();
      } else
      {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err)
    {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
    } finally
    {
      setLoading(false);
    }
  };

  // Close modal when clicking on overlay
  const handleOverlayClick = (e) =>
  {
    if (e.target.classList.contains(styles.overlay))
    {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Admin Login</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Username (hint: supwils)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Password (hint: 1234)"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;