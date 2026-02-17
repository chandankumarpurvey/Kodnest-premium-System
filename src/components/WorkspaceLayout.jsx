import React from 'react';

const WorkspaceLayout = ({ primary, secondary }) => {
    return (
        <div className="workspace-layout grid gap-4" style={{
            display: 'grid',
            gridTemplateColumns: '70% 30%', // Strict 70/30 split
            gap: 'var(--space-4)',
            alignItems: 'start'
        }}>
            <div className="primary-workspace">
                {primary}
            </div>
            <div className="secondary-panel">
                {secondary}
            </div>
        </div>
    );
};

export default WorkspaceLayout;
