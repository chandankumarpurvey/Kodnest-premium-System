import React from 'react';
import { MapPin, Briefcase, Clock, ExternalLink, Bookmark, Check, ChevronDown, Circle } from 'lucide-react';
import Button from './Button';
import { getScoreColor } from '../utils/scoring';

const JobCard = ({ job, onSave, onView, isSaved, status = 'Not Applied', onStatusChange }) => {

    const getStatusColor = (s) => {
        switch (s) {
            case 'Applied': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Selected': return 'text-green-600 bg-green-50 border-green-200';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-secondary bg-tertiary border-border';
        }
    };

    return (
        <div className="card hover:border-accent transition-colors duration-200 group relative bg-white">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-heading text-lg text-primary leading-tight mb-1 group-hover:text-accent transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-body font-medium">{job.company}</p>
                </div>

                {/* Source Badge */}
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs uppercase font-bold tracking-wider text-subtle border border-border px-2 py-1 rounded-sm">
                        {job.source}
                    </span>
                    {/* Match Score Badge */}
                    {job.matchScore !== undefined && (
                        <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: getScoreColor(job.matchScore) }}
                        >
                            {job.matchScore}% Match
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-secondary mb-4">
                <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location} ({job.mode})
                </div>
                <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {job.experience}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
                </div>
                <div className="font-semibold text-primary">
                    {job.salaryRange}
                </div>
            </div>

            <div className="mb-4">
                <div className="relative inline-block w-full">
                    <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium border rounded-md transition-colors ${getStatusColor(status)}`}
                    >
                        <span className="flex items-center gap-2">
                            <Circle size={10} fill="currentColor" />
                            {status}
                        </span>
                        <ChevronDown size={14} />
                    </button>
                    <select
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={status}
                        onChange={(e) => onStatusChange && onStatusChange(job.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">Applied</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => onView(job)} style={{ flex: 1 }}>
                    View Details
                </Button>

                <button
                    onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
                    className={`btn flex items-center justify-center gap-2 ${isSaved ? 'bg-accent text-white' : 'btn-secondary'}`}
                    style={{ width: '40px', padding: 0 }}
                    title={isSaved ? "Unsave" : "Save"}
                >
                    {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
                </button>

                <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center justify-center gap-2"
                    style={{ flex: 1, textDecoration: 'none' }}
                >
                    Apply
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

export default JobCard;
