import React, { useState, useEffect } from 'react';
import { Lock, Rocket, CheckCircle } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const ShipPage = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const saved = localStorage.getItem('jobTrackerTestStatus');
            const checked = saved ? JSON.parse(saved) : [];
            // Hardcoded 10 items expected
            setIsUnlocked(checked.length >= 10);
        };

        checkStatus();

        // Listen for updates (though usually this component mounts after nav)
        window.addEventListener('testStatusChanged', checkStatus);
        return () => window.removeEventListener('testStatusChanged', checkStatus);
    }, []);

    if (!isUnlocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Lock size={40} className="text-gray-400" />
                </div>
                <h2 className="font-heading text-3xl text-primary mb-2">Ship Guard Active</h2>
                <p className="text-secondary max-w-md mb-8">
                    You cannot access the deployment controls until all 10 Quality Assurance tests have passed.
                </p>
                <Link to="/jt/07-test">
                    <Button variant="primary" className="pl-6 pr-8">
                        Go to Verification Checklist
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-green-100">
                <Rocket size={48} className="text-success" />
            </div>
            <h2 className="font-heading text-4xl text-primary mb-2">Ready for Lift-off!</h2>
            <p className="text-secondary max-w-lg mb-8 text-lg">
                Quality Assurance is complete. The build is stable, verified, and ready for production deployment.
            </p>

            <div className="grid gap-4 w-full max-w-sm">
                <button className="btn btn-primary w-full py-3 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                    🚀 Trigger Deployment
                </button>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium bg-green-50 py-2 rounded border border-green-100">
                    <CheckCircle size={16} />
                    Verified Build ID: v1.0.0-rc
                </div>
            </div>
        </div>
    );
};

export default ShipPage;
