import React from 'react';

const ContextHeader = ({ title, description }) => {
    return (
        <div className="context-header mb-4">
            <h1 style={{
                fontSize: '32px',
                marginBottom: '8px',
                color: 'var(--color-text-primary)'
            }}>
                {title}
            </h1>
            <p style={{
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                maxWidth: '720px', // STRICT: Max 720px as per design rules
                lineHeight: '1.6'
            }}>
                {description}
            </p>
        </div>
    );
};

export default ContextHeader;
