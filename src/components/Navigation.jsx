import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavItem = ({ to, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
        }
        style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontWeight: 500,
            padding: '8px 0',
            borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
            transition: 'all 0.2s'
        })}
    >
        {label}
    </NavLink>
);

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [testCount, setTestCount] = useState(() => {
        const saved = localStorage.getItem('jobTrackerTestStatus');
        return saved ? JSON.parse(saved).length : 0;
    });

    React.useEffect(() => {
        const updateCount = () => {
            const saved = localStorage.getItem('jobTrackerTestStatus');
            setTestCount(saved ? JSON.parse(saved).length : 0);
        };
        window.addEventListener('testStatusChanged', updateCount);
        return () => window.removeEventListener('testStatusChanged', updateCount);
    }, []);

    const isShipUnlocked = testCount >= 10;

    const links = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/saved", label: "Saved" },
        { to: "/digest", label: "Digest" },
        { to: "/settings", label: "Settings" },
        { to: "/jt/proof", label: "Proof" },
        { to: "/jt/07-test", label: "Test" },
        { to: "/jt/08-ship", label: isShipUnlocked ? "🚀 Ship" : "🔒 Ship", locked: !isShipUnlocked },
    ];

    return (
        <nav className="main-nav mb-4">
            {/* Desktop Nav */}
            <div className="hidden-mobile flex gap-4 pb-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
                {links.map(link => (
                    <NavItem
                        key={link.to}
                        to={link.to}
                        label={link.label}
                        style={link.locked ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    />
                ))}
            </div>

            {/* Mobile Nav Toggle */}
            <div className="visible-mobile flex justify-end mb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="mobile-menu flex flex-col gap-2 p-4" style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    {links.map(link => (
                        <NavItem key={link.to} to={link.to} label={link.label} onClick={() => setIsOpen(false)} />
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .visible-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .visible-mobile { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navigation;
