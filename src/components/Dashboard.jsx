import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import JobCard from './JobCard';
import JobModal from './JobModal';
import EmptyState from './EmptyState';
import { jobs as initialJobs } from '../data/mockJobs';

const Dashboard = () => {
    const [jobs] = useState(initialJobs);
    const [searchQuery, setSearchQuery] = useState('');
    const [savedJobIds, setSavedJobIds] = useState(() => {
        const saved = localStorage.getItem('savedJobIds');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        localStorage.setItem('savedJobIds', JSON.stringify(savedJobIds));
    }, [savedJobIds]);

    const toggleSave = (id) => {
        setSavedJobIds(prev =>
            prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
        );
    };

    const handleView = (job) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const filteredJobs = jobs.filter(job => {
        const query = (searchQuery || '').toLowerCase();
        return (
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query)
        );
    });

    return (
        <div className="dashboard-container h-full flex flex-col">
            <FilterBar onSearch={setSearchQuery} />

            <div className="job-grid grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 overflow-y-auto">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSave={toggleSave}
                            onView={handleView}
                            isSaved={savedJobIds.includes(job.id)}
                        />
                    ))
                ) : (
                    <div className="col-span-full">
                        <EmptyState
                            type="search"
                            message="No jobs found"
                            subtext="Try adjusting your filters or search keywords."
                        />
                    </div>
                )}
            </div>

            {selectedJob && (
                <JobModal
                    job={selectedJob}
                    onClose={handleCloseModal}
                    savedJobIds={savedJobIds}
                    onSave={toggleSave}
                />
            )}
        </div>
    );
};

export default Dashboard;
