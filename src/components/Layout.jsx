import React from 'react';
import TopBar from './TopBar';
import ProofFooter from './ProofFooter';

const Layout = ({ children, step, totalSteps, status }) => {
    return (
        <div className="app-shell flex flex-col" style={{ minHeight: '100vh' }}>
            <TopBar step={step} totalSteps={totalSteps} status={status} />

            <main className="flex-1" style={{
                paddingTop: 'var(--space-4)',
                paddingBottom: 'calc(var(--footer-height) + var(--space-4))'
            }}>
                <div className="container">
                    {children}
                </div>
            </main>

            <ProofFooter />
        </div>
    );
};

export default Layout;
