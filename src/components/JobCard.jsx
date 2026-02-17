import React from 'react';
import { MapPin, Briefcase, Clock, ExternalLink, Bookmark, Check } from 'lucide-react';
import Button from './Button';

const JobCard = ({ job, onSave, onView, isSaved }) => {
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
                <span className="text-xs uppercase font-bold tracking-wider text-subtle border border-border px-2 py-1 rounded-sm">
                    {job.source}
                </span>
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
