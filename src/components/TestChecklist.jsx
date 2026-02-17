import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, RotateCcw, Info, AlertTriangle } from 'lucide-react';
import Button from './Button';

const CHECKLIST_ITEMS = [
    { id: 1, label: "Preferences persist after refresh", tip: "Go to Settings, save, reload page, check if values remain." },
    { id: 2, label: "Match score calculates correctly", tip: "Verify scores change when you update preferences." },
    { id: 3, label: "\"Show only matches\" toggle works", tip: "Enable toggle, ensuring low-score jobs disappear." },
    { id: 4, label: "Save job persists after refresh", tip: "Save a job, reload, check Saved tab." },
    { id: 5, label: "Apply opens in new tab", tip: "Click Apply, verify new tab with Google search." },
    { id: 6, label: "Status update persists after refresh", tip: "Change status to Applied, reload, verify it remains." },
    { id: 7, label: "Status filter works correctly", tip: "Filter by Applied, ensure only applied jobs show." },
    { id: 8, label: "Digest generates top 10 by score", tip: "Check Digest tab, verify job count and relevance." },
    { id: 9, label: "Digest persists for the day", tip: "Reload page, Digest should show same jobs." },
    { id: 10, label: "No console errors on main pages", tip: "Open F12 Console, navigate through all tabs." }
];

const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('jobTrackerTestStatus');
        return saved ? JSON.parse(saved) : [];
    });

    const [showTip, setShowTip] = useState(null);

    useEffect(() => {
        localStorage.setItem('jobTrackerTestStatus', JSON.stringify(checkedItems));
        // Dispatch event so Navigation can update
        window.dispatchEvent(new Event('testStatusChanged'));
    }, [checkedItems]);

    const toggleCheck = (id) => {
        setCheckedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const resetTests = () => {
        if (confirm('Are you sure you want to reset all test progress?')) {
            setCheckedItems([]);
        }
    };

    const progress = checkedItems.length;
    const total = CHECKLIST_ITEMS.length;
    const isComplete = progress === total;

    return (
        <div className="test-checklist-container max-w-2xl mx-auto p-1">
            <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                {/* Header */}
                <div className={`p-6 border-b border-border ${isComplete ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                                {isComplete ? <CheckCircle className="text-success" /> : <AlertTriangle className="text-warning" />}
                                Release Readiness
                            </h2>
                            <p className="text-secondary text-sm mt-1">
                                {isComplete
                                    ? "All systems go! You are ready to ship."
                                    : "Complete all verification steps to unlock shipping."}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-bold ${isComplete ? 'text-success' : 'text-primary'}`}>
                                {progress} / {total}
                            </span>
                            <div className="text-xs text-secondary uppercase tracking-wider font-semibold">Tests Passed</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isComplete ? 'bg-success' : 'bg-primary'}`}
                            style={{ width: `${(progress / total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-border">
                    {CHECKLIST_ITEMS.map(item => {
                        const isChecked = checkedItems.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group`}
                                onClick={() => toggleCheck(item.id)}
                            >
                                <div className={`mt-1 transition-colors ${isChecked ? 'text-success' : 'text-gray-300 group-hover:text-primary'}`}>
                                    {isChecked ? <CheckCircle size={22} fill="currentColor" className="text-white" /> : <Circle size={22} />}
                                </div>
                                <div className="flex-1">
                                    <div className={`font-medium ${isChecked ? 'text-secondary line-through decoration-border' : 'text-primary'}`}>
                                        {item.label}
                                    </div>
                                    {showTip === item.id && (
                                        <div className="text-xs text-accent mt-1 bg-accent/10 p-2 rounded inline-block">
                                            💡 {item.tip}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowTip(showTip === item.id ? null : item.id); }}
                                    className="text-gray-400 hover:text-accent transition-colors"
                                    title="How to test"
                                >
                                    <Info size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-border flex justify-between items-center">
                    <div className="text-xs text-secondary">
                        {isComplete ? "✅ Section /jt/08-ship is now unlocked." : "🔒 Section /jt/08-ship is locked."}
                    </div>
                    {progress > 0 && (
                        <button
                            onClick={resetTests}
                            className="flex items-center gap-1 text-xs text-secondary hover:text-red-500 transition-colors font-medium"
                        >
                            <RotateCcw size={12} />
                            Reset Test Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestChecklist;
