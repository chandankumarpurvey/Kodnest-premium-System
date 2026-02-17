import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const NotFound = () => {
    return (
        <div className="not-found-container" style={{
            textAlign: 'center',
            padding: 'var(--space-5) var(--space-3)',
            color: 'var(--color-text-secondary)'
        }}>
            <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '3rem',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-3)'
            }}>404</h1>

            <h2 style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--space-2)',
                color: 'var(--color-text-primary)'
            }}>Page Not Found</h2>

            <p style={{ marginBottom: 'var(--space-4)' }}>
                The page you are looking for does not exist or has been moved.
            </p>

            <Link to="/dashboard">
                <Button variant="primary">Return to Dashboard</Button>
            </Link>
        </div>
    );
};

export default NotFound;
