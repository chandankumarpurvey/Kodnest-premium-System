import React from 'react';
import { Copy, Hammer, CheckCircle, AlertTriangle, Image } from 'lucide-react';

const SecondaryPanel = () => {
    return (
        <div className="secondary-panel-content flex flex-col gap-3">
            {/* Step Explanation */}
            <div className="step-explanation p-3" style={{
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
            }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Step 1:</strong> Configure the core properties of your build. Ensure all tokens are defined before proceeding.
            </div>

            {/* Prompt Box */}
            <div className="prompt-box">
                <label style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    display: 'block',
                    marginBottom: '8px'
                }}>
                    Build Prompt
                </label>
                <textarea
                    className="input"
                    rows={6}
                    readOnly
                    value="Create a responsive navigation bar with a logo on the left, links in the center, and a CTA button on the right. Use the design tokens for spacing and colors."
                    style={{
                        resize: 'none',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)'
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="actions flex flex-col gap-2 mt-2">
                <button className="btn btn-secondary w-full justify-between" style={{ width: '100%' }}>
                    <span>Copy Prompt</span>
                    <Copy size={16} />
                </button>

                <button className="btn btn-primary w-full justify-between" style={{ width: '100%' }}>
                    <span>Build in Lovable</span>
                    <Hammer size={16} />
                </button>

                <div className="feedback-actions grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-2)'
                }}>
                    <button className="btn btn-secondary" style={{
                        borderColor: 'var(--color-success)',
                        color: 'var(--color-success)'
                    }}>
                        <CheckCircle size={16} />
                        Worked
                    </button>

                    <button className="btn btn-secondary" style={{
                        borderColor: 'var(--color-warning)',
                        color: 'var(--color-warning)'
                    }}>
                        <AlertTriangle size={16} />
                        Error
                    </button>
                </div>

                <button className="btn btn-secondary w-full justify-between" style={{ width: '100%', borderStyle: 'dashed' }}>
                    <span>Add Screenshot</span>
                    <Image size={16} />
                </button>
            </div>
        </div>
    );
};

export default SecondaryPanel;
