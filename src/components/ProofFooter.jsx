import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';

const ProofItem = ({ label, checked, onChange }) => (
    <div
        className="proof-item flex items-center gap-2 cursor-pointer"
        onClick={onChange}
        style={{ opacity: checked ? 1 : 0.6, transition: 'opacity 0.2s' }}
    >
        {checked ? <CheckSquare size={18} color="var(--color-success)" /> : <Square size={18} />}
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
    </div>
);

const ProofFooter = () => {
    const [proofs, setProofs] = useState({
        uiBuilt: false,
        logicWorking: false,
        testPassed: false,
        deployed: false
    });

    const toggle = (key) => setProofs(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <footer className="proof-footer" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'var(--footer-height)',
            backgroundColor: 'var(--color-bg)',
            borderTop: '1px solid var(--color-border)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container flex items-center justify-between">
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Proof of Work
                </div>

                <div className="flex items-center gap-4">
                    <ProofItem
                        label="UI Built"
                        checked={proofs.uiBuilt}
                        onChange={() => toggle('uiBuilt')}
                    />
                    <ProofItem
                        label="Logic Working"
                        checked={proofs.logicWorking}
                        onChange={() => toggle('logicWorking')}
                    />
                    <ProofItem
                        label="Test Passed"
                        checked={proofs.testPassed}
                        onChange={() => toggle('testPassed')}
                    />
                    <ProofItem
                        label="Deployed"
                        checked={proofs.deployed}
                        onChange={() => toggle('deployed')}
                    />
                </div>
            </div>
        </footer>
    );
};

export default ProofFooter;
