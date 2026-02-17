import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Copy, AlertTriangle, Package } from 'lucide-react';
import Button from './Button';

const STEPS = [
    "Project Setup & Design System",
    "Global Layout & Navigation",
    "Job Dashboard & Data",
    "Search & Filtering",
    "Saved Jobs & Persistence",
    "Daily Digest Engine",
    "Status Tracking System",
    "Quality Assurance Checklist"
];

const ProofPage = () => {
    // State for links
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('jobTrackerProofLinks');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deploy: '' };
    });

    // Validations
    const [touched, setTouched] = useState({});

    // Status
    const [testPassed, setTestPassed] = useState(false);

    // Toast
    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem('jobTrackerProofLinks', JSON.stringify(links));
    }, [links]);

    useEffect(() => {
        // Check tests
        const savedTests = localStorage.getItem('jobTrackerTestStatus');
        const checkedCount = savedTests ? JSON.parse(savedTests).length : 0;
        setTestPassed(checkedCount >= 10);
    }, []);

    const handleChange = (field, value) => {
        setLinks(prev => ({ ...prev, [field]: value }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const isValidUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    const isFormValid =
        isValidUrl(links.lovable) &&
        isValidUrl(links.github) &&
        isValidUrl(links.deploy);

    const isShipped = isFormValid && testPassed;

    const copyToClipboard = () => {
        const text = `------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable}

GitHub Repository:
${links.github}

Live Deployment:
${links.deploy}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`;

        navigator.clipboard.writeText(text);
        setToast("Submission copied to clipboard!");
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="proof-container max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-heading text-3xl text-primary mb-2">Project 1 — Job Notification Tracker</h1>
                    <p className="text-secondary">Final verification and submission interface.</p>
                </div>
                <div>
                    <Badge status={isShipped ? 'Shipped' : (testPassed || isFormValid ? 'In Progress' : 'Not Started')} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Artifacts */}
                <div className="md:col-span-2 space-y-6">
                    {/* B) Artifact Collection */}
                    <div className="bg-white p-6 rounded-lg border border-border">
                        <h2 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
                            <Package size={20} />
                            Artifact Collection
                        </h2>

                        <div className="space-y-4">
                            <InputGroup
                                label="Lovable Project Link"
                                value={links.lovable}
                                onChange={(val) => handleChange('lovable', val)}
                                onBlur={() => handleBlur('lovable')}
                                error={touched.lovable && !isValidUrl(links.lovable) ? "Please enter a valid URL" : null}
                                placeholder="https://lovable.dev/..."
                            />
                            <InputGroup
                                label="GitHub Repository Link"
                                value={links.github}
                                onChange={(val) => handleChange('github', val)}
                                onBlur={() => handleBlur('github')}
                                error={touched.github && !isValidUrl(links.github) ? "Please enter a valid URL" : null}
                                placeholder="https://github.com/..."
                            />
                            <InputGroup
                                label="Deployed URL"
                                value={links.deploy}
                                onChange={(val) => handleChange('deploy', val)}
                                onBlur={() => handleBlur('deploy')}
                                error={touched.deploy && !isValidUrl(links.deploy) ? "Please enter a valid URL" : null}
                                placeholder="https://vercel.com/..."
                            />
                        </div>
                    </div>

                    {/* Submission Action */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-border flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-primary">Final Submission</h3>
                            <p className="text-sm text-secondary">Export your project details for review.</p>
                        </div>
                        <Button
                            variant="primary"
                            disabled={!isShipped}
                            onClick={copyToClipboard}
                            icon={<Copy size={16} />}
                        >
                            Copy Final Submission
                        </Button>
                    </div>

                    {isShipped && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded text-center text-green-700 font-medium animate-in fade-in">
                            Project 1 Shipped Successfully.
                        </div>
                    )}
                </div>

                {/* Right Column: Status Summary */}
                <div className="space-y-6">
                    {/* A) Step Completion */}
                    <div className="bg-white p-6 rounded-lg border border-border">
                        <h2 className="font-heading text-lg text-primary mb-4">Step Completion</h2>
                        <div className="space-y-3">
                            {STEPS.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle size={16} className="text-success" />
                                    <span className="text-secondary">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completion Requirements */}
                    <div className="bg-white p-6 rounded-lg border border-border">
                        <h2 className="font-heading text-lg text-primary mb-4">Ship Requirements</h2>
                        <div className="space-y-3 text-sm">
                            <Requirement
                                label="10/10 Tests Passed"
                                Met={testPassed}
                            />
                            <Requirement
                                label="Artifact Links Provided"
                                Met={isFormValid}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow-lg text-sm animate-in slide-in-from-bottom-2">
                    {toast}
                </div>
            )}
        </div>
    );
};

const InputGroup = ({ label, value, onChange, onBlur, error, placeholder }) => (
    <div>
        <label className="block text-xs font-semibold text-secondary uppercase mb-1">{label}</label>
        <div className="relative">
            <input
                type="text"
                className={`input w-full ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
            />
            {value && !error && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success">
                    <CheckCircle size={16} />
                </div>
            )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const Badge = ({ status }) => {
    const styles = {
        'Shipped': 'bg-green-100 text-green-700 border-green-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
        'Not Started': 'bg-gray-100 text-gray-500 border-gray-200'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

const Requirement = ({ label, Met }) => (
    <div className="flex items-center gap-2">
        {Met ? <CheckCircle size={16} className="text-success" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
        <span className={Met ? "text-primary font-medium" : "text-secondary"}>{label}</span>
    </div>
);

export default ProofPage;
