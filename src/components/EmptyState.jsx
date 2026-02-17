import React from 'react';
import { Ghost, SearchX, Bookmark } from 'lucide-react';

const EmptyState = ({ type = 'general', message, subtext, action }) => {
    let Icon = Ghost;
    if (type === 'search') Icon = SearchX;
    if (type === 'saved') Icon = Bookmark;

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full" style={{ minHeight: '300px', color: 'var(--color-text-secondary)' }}>
            <div style={{
                padding: '24px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderRadius: '50%',
                marginBottom: '24px'
            }}>
                <Icon size={48} strokeWidth={1.5} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                marginBottom: '8px',
                color: 'var(--color-text-primary)'
            }}>{message}</h3>
            <p style={{ maxWidth: '300px', margin: '0 auto 24px', fontSize: '14px' }}>
                {subtext}
            </p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};

export default EmptyState;
