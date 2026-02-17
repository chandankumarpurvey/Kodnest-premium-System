import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const TopBar = ({ step = 1, totalSteps = 5, status = 'In Progress' }) => {
  return (
    <header className="top-bar">
      <div className="container flex items-center justify-between" style={{ height: 'var(--topbar-height)' }}>
        {/* Left: Project Name */}
        <div className="project-identity flex items-center gap-2">
          <div className="logo-mark" style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'var(--color-text-primary)',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontWeight: 600, fontSize: '16px' }}>KodNest Premium</span>
        </div>

        {/* Center: Progress */}
        <div className="progress-indicator flex items-center gap-2" style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-secondary)',
          fontSize: '14px'
        }}>
          <span>Step {step}</span>
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <span>{totalSteps}</span>
        </div>

        {/* Right: Status Badge */}
        <div className="status-badge flex items-center gap-2 px-3 py-1" style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-warning)',
          color: 'var(--color-warning)',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Clock size={14} />
          {status}
        </div>
      </div>
      <div style={{
        height: '1px',
        backgroundColor: 'var(--color-border)',
        width: '100%'
      }}></div>
    </header>
  );
};

export default TopBar;
