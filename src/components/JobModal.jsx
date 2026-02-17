import React from 'react';
import { X, MapPin, Briefcase, Building2 } from 'lucide-react';
import Button from './Button';

const JobModal = ({ job, onClose, onApply }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
                style={{ borderTop: '4px solid var(--color-accent)' }}
            >
                {/* Header */}
                <div className="p-6 border-b border-border sticky top-0 bg-white z-10 flex justify-between items-start">
                    <div>
                        <h2 className="font-heading text-2xl text-primary mb-1">{job.title}</h2>
                        <div className="flex items-center gap-2 text-secondary">
                            <Building2 size={16} />
                            <span className="font-medium">{job.company}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-bg rounded-md border border-border">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-subtle block mb-1">Location</label>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <MapPin size={16} className="text-accent" />
                                {job.location} ({job.mode})
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-subtle block mb-1">Experience</label>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <Briefcase size={16} className="text-accent" />
                                {job.experience}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-subtle block mb-1">Salary</label>
                            <div className="text-primary font-medium">{job.salaryRange}</div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-subtle block mb-1">Posted</label>
                            <div className="text-primary font-medium">{job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-heading text-lg mb-3 border-b border-border pb-2">About the Role</h3>
                        <p className="text-body leading-relaxed text-secondary opacity-90">
                            {job.description}
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="font-heading text-lg mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-white border border-border rounded-full text-sm text-secondary"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-bg sticky bottom-0 flex justify-end gap-3 rounded-b-lg">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ textDecoration: 'none' }}
                    >
                        Apply Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default JobModal;
