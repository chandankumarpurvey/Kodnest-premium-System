import React from 'react';
import { ArrowRight, Search, Check } from 'lucide-react';

const DesignSystemDemo = () => {
    return (
        <div className="design-system-demo flex flex-col gap-4">

            {/* Introduction Card */}
            <div className="card">
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Core Components</h2>
                <p className="text-body mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    This system uses a strict 4-color palette and a mathematical spacing scale.
                    No gradients, no shadows, no noise.
                </p>

                <div className="flex gap-4 items-center mb-4">
                    <button className="btn btn-primary">
                        Primary Action
                        <ArrowRight size={18} />
                    </button>

                    <button className="btn btn-secondary">
                        Secondary Action
                    </button>

                    <button className="btn btn-secondary" style={{ borderRadius: '100px', width: '40px', padding: 0 }}>
                        <Search size={18} />
                    </button>
                </div>
            </div>

            {/* Form Elements Card */}
            <div className="card">
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Input Fields</h3>
                <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div>
                        <label className="text-subtle mb-1" style={{ display: 'block', fontWeight: 500 }}>Project Name</label>
                        <input type="text" className="input" placeholder="e.g. KodNest Premium" />
                    </div>
                    <div>
                        <label className="text-subtle mb-1" style={{ display: 'block', fontWeight: 500 }}>Workspace URL</label>
                        <input type="text" className="input" placeholder="kodnest.com/workspace" />
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" id="terms" style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                    <label htmlFor="terms" className="text-body" style={{ fontSize: '14px' }}>
                        I agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Design Philosophy</span>
                    </label>
                </div>
            </div>

            {/* Typography Scale */}
            <div className="card">
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Typography Scale</h3>
                <div className="flex flex-col gap-2">
                    <h1 style={{ fontSize: '40px' }}>Heading 1 (Serif 40px)</h1>
                    <h2 style={{ fontSize: '32px' }}>Heading 2 (Serif 32px)</h2>
                    <h3 style={{ fontSize: '24px' }}>Heading 3 (Serif 24px)</h3>
                    <p className="text-body">
                        Body text (Sans-serif 16px). The quick brown fox jumps over the lazy dog.
                        Calm, intentional, coherent, confident. detailed and generous spacing.
                    </p>
                    <p className="text-subtle">
                        Subtle text (Sans-serif 14px). Used for labels, hints, and secondary information.
                    </p>
                </div>
            </div>

            {/* Status Badges Demo */}
            <div className="card flex gap-4 items-center">
                <div style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(74, 122, 94, 0.1)',
                    color: 'var(--color-success)',
                    borderRadius: '100px',
                    fontSize: '12px', fontWeight: 600, textTransform: 'uppercase'
                }}>
                    Success
                </div>

                <div style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(181, 137, 0, 0.1)',
                    color: 'var(--color-warning)',
                    borderRadius: '100px',
                    fontSize: '12px', fontWeight: 600, textTransform: 'uppercase'
                }}>
                    Warning
                </div>

                <div style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(139, 0, 0, 0.1)',
                    color: 'var(--color-accent)',
                    borderRadius: '100px',
                    fontSize: '12px', fontWeight: 600, textTransform: 'uppercase'
                }}>
                    Critical
                </div>
            </div>
        </div>
    );
};

export default DesignSystemDemo;
