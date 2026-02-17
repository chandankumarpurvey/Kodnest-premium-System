import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobModal from './JobModal';
import EmptyState from './EmptyState';
import Button from './Button';
import { jobs as allJobs } from '../data/mockJobs';
import { Link } from 'react-router-dom';

const Saved = () => {
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

    const savedJobs = allJobs.filter(job => savedJobIds.includes(job.id));

    return (
        <div className="saved-container h-full flex flex-col">
            <div className="mb-6">
                <h2 className="font-heading text-2xl text-primary">Saved Jobs ({savedJobs.length})</h2>
            </div>

            <div className="job-grid grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 overflow-y-auto flex-1">
                {savedJobs.length > 0 ? (
                    savedJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSave={toggleSave}
                            onView={setSelectedJob}
                            isSaved={true}
                        />
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <EmptyState
                            type="saved"
                            message="No saved jobs yet"
                            subtext="Jobs you bookmark will appear here for easy access."
                            action={
                                <Link to="/dashboard">
                                    <Button variant="primary">Browse Jobs</Button>
                                </Link>
                            }
                        />
                    </div>
                )}
            </div>

            {selectedJob && (
                <JobModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    );
};

export default Saved;
