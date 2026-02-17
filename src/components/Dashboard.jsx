import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './FilterBar';
import JobCard from './JobCard';
import JobModal from './JobModal';
import EmptyState from './EmptyState';
import Button from './Button';
import { Link } from 'react-router-dom';
import { jobs as initialJobs } from '../data/mockJobs';
import { calculateMatchScore } from '../utils/scoring';
import { Settings } from 'lucide-react';

const Dashboard = () => {
    const [jobs] = useState(initialJobs);
    const [searchQuery, setSearchQuery] = useState('');
    const [savedJobIds, setSavedJobIds] = useState(() => {
        const saved = localStorage.getItem('savedJobIds');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [showMatchesOnly, setShowMatchesOnly] = useState(false);
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'score' | 'salary'

    // Lifted Filter State
    const [filters, setFilters] = useState({
        location: '',
        experience: '',
        mode: '',
        status: ''
    });

    const [toastMessage, setToastMessage] = useState(null);

    const [jobStatus, setJobStatus] = useState(() => {
        const saved = localStorage.getItem('jobTrackerStatus');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('jobTrackerStatus', JSON.stringify(jobStatus));
    }, [jobStatus]);

    const handleStatusChange = (jobId, newStatus) => {
        const job = jobs.find(j => j.id === jobId);
        setJobStatus(prev => {
            if (newStatus === 'Not Applied') {
                const newState = { ...prev };
                delete newState[jobId];
                return newState;
            }
            return {
                ...prev,
                [jobId]: { status: newStatus, date: new Date().toISOString() }
            };
        });

        setToastMessage(`Status updated to: ${newStatus}${job ? ` for ${job.company}` : ''}`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        localStorage.setItem('savedJobIds', JSON.stringify(savedJobIds));
    }, [savedJobIds]);

    useEffect(() => {
        const prefs = localStorage.getItem('jobTrackerPreferences');
        if (prefs) {
            setPreferences(JSON.parse(prefs));
            setSortBy('score'); // Default to score sort if prefs exist
        }
    }, []);

    const toggleSave = (id) => {
        setSavedJobIds(prev =>
            prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
        );
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // calculate scores
    const jobsWithScores = useMemo(() => {
        if (!preferences) return jobs.map(j => ({ ...j, matchScore: 0 }));
        return jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, preferences)
        }));
    }, [jobs, preferences]);

    // Filter and Sort
    const filteredJobs = useMemo(() => {
        let result = jobsWithScores;

        // 1. Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query)
            );
        }

        // 2. Filters (Location, Experience, Mode)
        if (filters.location && filters.location !== 'All') {
            result = result.filter(job => job.location.includes(filters.location) || (filters.location === 'Remote' && job.mode === 'Remote'));
        }
        if (filters.experience && filters.experience !== 'All') {
            // Rough match for experience string
            const normalize = s => s.toLowerCase().replace('years', '').replace('year', '').replace('+', '').trim();
            const jobExp = normalize(job.experience);
            const filterExp = normalize(filters.experience);
            // If filter is "Fresher", look for "Fresher" or "0"
            if (filterExp === 'fresher') {
                result = result.filter(job => jobExp.includes('fresher') || jobExp.includes('0'));
            } else {
                result = result.filter(job => jobExp.includes(filterExp));
            }
        }
        if (filters.mode && filters.mode !== 'All') {
            result = result.filter(job => job.mode === filters.mode);
        }

        // 3. Status Filter (New)
        if (filters.status && filters.status !== 'All') {
            if (filters.status === 'Not Applied') {
                result = result.filter(job => !jobStatus[job.id]);
            } else {
                result = result.filter(job => jobStatus[job.id]?.status === filters.status);
            }
        }

        // 3. "Show Matches Only" Toggle
        if (showMatchesOnly && preferences) {
            result = result.filter(job => job.matchScore >= (preferences.minMatchScore || 40));
        }

        // 4. Sorting
        result.sort((a, b) => {
            if (sortBy === 'score') {
                if (b.matchScore === a.matchScore) return a.postedDaysAgo - b.postedDaysAgo;
                return b.matchScore - a.matchScore;
            } else if (sortBy === 'latest') {
                return a.postedDaysAgo - b.postedDaysAgo;
            } else if (sortBy === 'salary') {
                // Extract max salary with unit normalization
                const extractNormalizedSalary = (s) => {
                    const lower = s.toLowerCase();
                    const nums = s.match(/(\d+\.?\d*)/g);
                    if (!nums) return 0;
                    const maxVal = Math.max(...nums.map(Number));

                    if (lower.includes('lpa')) return maxVal * 100000;
                    if (lower.includes('k')) return maxVal * 1000;
                    if (lower.includes('month')) return maxVal; // Fallback
                    return maxVal;
                };
                return extractNormalizedSalary(b.salaryRange) - extractNormalizedSalary(a.salaryRange);
            }
            return 0;
        });

        return result;
    }, [jobsWithScores, searchQuery, showMatchesOnly, preferences, sortBy, filters]);


    return (
        <div className="dashboard-container h-full flex flex-col">
            {/* Preferences Banner */}
            {!preferences && (
                <div className="bg-primary text-white p-3 px-4 rounded-md mb-4 flex justify-between items-center shadow-lg">
                    <div className="text-sm font-medium">
                        🚀 Set your preferences to activate intelligent matching.
                    </div>
                    <Link to="/settings">
                        <Button variant="secondary" className="text-xs py-1 h-auto" style={{ border: 'none' }}>
                            Configure Now
                        </Button>
                    </Link>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-4">
                <FilterBar
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Visual Controls Row */}
                <div className="flex justify-between items-center px-1">
                    <div className="flex gap-2">
                        {/* Sort Toggles */}
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${sortBy === 'latest' ? 'bg-secondary text-white border-secondary' : 'bg-white text-secondary border-border'}`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setSortBy('score')}
                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${sortBy === 'score' ? 'bg-accent text-white border-accent' : 'bg-white text-secondary border-border'}`}
                            disabled={!preferences}
                            title={!preferences ? "Set preferences first" : "Sort by Match Score"}
                        >
                            Best Match
                        </button>
                        <button
                            onClick={() => setSortBy('salary')}
                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${sortBy === 'salary' ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-border'}`}
                        >
                            High Salary
                        </button>
                    </div>

                    {/* Match Toggle */}
                    {preferences && (
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary select-none">
                            <input
                                type="checkbox"
                                checked={showMatchesOnly}
                                onChange={(e) => setShowMatchesOnly(e.target.checked)}
                                className="accent-accent w-4 h-4"
                            />
                            Show only matches &gt; {preferences.minMatchScore}%
                        </label>
                    )}
                </div>


                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        {toastMessage}
                    </div>
                )}
            </div>

            <div className="job-grid grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 overflow-y-auto flex-1">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSave={toggleSave}
                            onView={setSelectedJob}
                            isSaved={savedJobIds.includes(job.id)}
                            status={jobStatus[job.id]?.status || 'Not Applied'}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-10">
                        <EmptyState
                            type="search" // Reusing generic search icon
                            message={showMatchesOnly ? "No matches found" : "No jobs found"}
                            subtext={showMatchesOnly
                                ? "Try lowering your minimum score threshold or adjusting your preferences."
                                : "Try adjusting your filters or search keywords."}
                            action={showMatchesOnly && (
                                <Link to="/settings">
                                    <Button variant="primary">Adjust Preferences</Button>
                                </Link>
                            )}
                        />
                    </div>
                )}
            </div>

            {selectedJob && (
                <JobModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    savedJobIds={savedJobIds}
                    onSave={toggleSave}
                />
            )}
        </div>
    );
};

export default Dashboard;
