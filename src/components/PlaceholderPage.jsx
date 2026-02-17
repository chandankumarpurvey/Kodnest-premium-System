import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="placeholder-page flex flex-col gap-4" style={{
            padding: 'var(--space-5) 0',
            maxWidth: '720px'
        }}>
            <h1 style={{
                fontSize: '48px',
                marginBottom: 'var(--space-2)',
                color: 'var(--color-text-primary)'
            }}>
                {title}
            </h1>

            <p style={{
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic'
            }}>
                This section will be built in the next step.
            </p>

            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--color-border)',
                marginTop: 'var(--space-4)'
            }}></div>
        </div>
    );
};

export default PlaceholderPage;
