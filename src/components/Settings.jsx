import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Save, Check } from 'lucide-react';

const Settings = () => {
    const [preferences, setPreferences] = useState({
        roleKeywords: '',
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: '',
        skills: '',
        minMatchScore: 40
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs));
        }
    }, []);

    const handleChange = (field, value) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleModeToggle = (mode) => {
        setPreferences(prev => {
            const modes = prev.preferredMode || [];
            if (modes.includes(mode)) {
                return { ...prev, preferredMode: modes.filter(m => m !== mode) };
            } else {
                return { ...prev, preferredMode: [...modes, mode] };
            }
        });
        setSaved(false);
    };

    const handleLocationToggle = (loc) => {
        setPreferences(prev => {
            const locs = prev.preferredLocations || [];
            if (locs.includes(loc)) {
                return { ...prev, preferredLocations: locs.filter(l => l !== loc) };
            } else {
                return { ...prev, preferredLocations: [...locs, loc] };
            }
        });
        setSaved(false);
    };


    const handleSave = () => {
        localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const commonLocations = ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Delhi NCR', 'Mumbai'];

    return (
        <div className="settings-container max-w-2xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl text-primary">Preferences</h2>
                {saved && <span className="text-accent flex items-center gap-1 text-sm font-medium animate-fade-in"><Check size={16} /> Saved</span>}
            </div>

            <div className="bg-white p-6 rounded-lg border border-border space-y-8 shadow-sm">

                {/* Role Keywords */}
                <section>
                    <label className="block text-sm font-bold text-primary mb-2">Role Keywords</label>
                    <p className="text-xs text-secondary mb-3">Comma-separated (e.g., "Frontend, React, SDE")</p>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="e.g. Software Engineer, Frontend Developer"
                        value={preferences.roleKeywords}
                        onChange={(e) => handleChange('roleKeywords', e.target.value)}
                    />
                </section>

                {/* Locations */}
                <section>
                    <label className="block text-sm font-bold text-primary mb-3">Preferred Locations</label>
                    <div className="flex flex-wrap gap-2">
                        {commonLocations.map(loc => (
                            <button
                                key={loc}
                                onClick={() => handleLocationToggle(loc)}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${preferences.preferredLocations?.includes(loc)
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-secondary border-border hover:border-primary'
                                    }`}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Work Mode */}
                <section>
                    <label className="block text-sm font-bold text-primary mb-3">Work Mode</label>
                    <div className="flex gap-4">
                        {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                            <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.preferredMode?.includes(mode)}
                                    onChange={() => handleModeToggle(mode)}
                                    className="w-4 h-4 accent-accent"
                                />
                                <span className="text-secondary">{mode}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section>
                    <label className="block text-sm font-bold text-primary mb-2">Experience Level</label>
                    <select
                        className="input w-full"
                        value={preferences.experienceLevel}
                        onChange={(e) => handleChange('experienceLevel', e.target.value)}
                    >
                        <option value="">Select Experience</option>
                        <option value="Fresher">Fresher (0y)</option>
                        <option value="0-1y">0-1 Years</option>
                        <option value="1-3y">1-3 Years</option>
                        <option value="3-5y">3-5 Years</option>
                        <option value="5+y">5+ Years</option>
                    </select>
                </section>

                {/* Skills */}
                <section>
                    <label className="block text-sm font-bold text-primary mb-2">Skills</label>
                    <p className="text-xs text-secondary mb-3">Comma-separated (e.g., "Javascript, Python, AWS")</p>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="e.g. React, Node.js, Java"
                        value={preferences.skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                    />
                </section>

                {/* Min Match Score */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-primary">Minimum Match Score</label>
                        <span className="text-accent font-bold">{preferences.minMatchScore}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={preferences.minMatchScore}
                        onChange={(e) => handleChange('minMatchScore', parseInt(e.target.value))}
                        className="w-full accent-accent h-2 bg-border rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-secondary mt-2">Jobs below this score will be hidden when "Show Only Matches" is active.</p>
                </section>

                <div className="pt-4 border-t border-border">
                    <Button variant="primary" onClick={handleSave} className="w-full flex justify-center items-center gap-2">
                        <Save size={18} />
                        Save Preferences
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
