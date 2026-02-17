import React from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronDown, CheckCircle } from 'lucide-react';
import Button from './Button';

const FilterBar = ({
    searchQuery,
    onSearch,
    filters,
    onFilterChange
}) => {
    return (
        <div className="filter-bar-container grid gap-4 p-4 mb-6" style={{
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            zIndex: 20
        }}>
            {/* Top Row: Search */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Search by role, company, or skills..."
                        className="input"
                        style={{ paddingLeft: '40px', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <Button variant="primary">Search</Button>
            </div>

            {/* Bottom Row: Filters */}
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <FilterSelect
                    icon={<CheckCircle size={16} />}
                    label={filters.status || "Status"}
                    active={!!filters.status && filters.status !== 'All'}
                    options={['Not Applied', 'Applied', 'Selected', 'Rejected']}
                    onChange={(val) => onFilterChange('status', val)}
                />
                <FilterSelect
                    icon={<MapPin size={16} />}
                    label={filters.location || "Location"}
                    active={!!filters.location}
                    options={['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Delhi NCR', 'Mumbai', 'Remote']}
                    onChange={(val) => onFilterChange('location', val)}
                />
                <FilterSelect
                    icon={<Briefcase size={16} />}
                    label={filters.experience || "Experience"}
                    active={!!filters.experience}
                    options={['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years']}
                    onChange={(val) => onFilterChange('experience', val)}
                />
                <FilterSelect
                    icon={<Filter size={16} />}
                    label={filters.mode || "Mode"}
                    active={!!filters.mode}
                    options={['Remote', 'Hybrid', 'Onsite']}
                    onChange={(val) => onFilterChange('mode', val)}
                />

                {/* Clear All Button */}
                {(filters.location || filters.experience || filters.mode || filters.status) && (
                    <button
                        onClick={() => {
                            onFilterChange('location', '');
                            onFilterChange('experience', '');
                            onFilterChange('mode', '');
                            onFilterChange('status', '');
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 whitespace-nowrap"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

const FilterSelect = ({ icon, label, active, options, onChange }) => (
    <div className="relative group">
        <button
            className={`btn flex items-center gap-2 ${active ? 'bg-primary text-white' : 'btn-secondary'}`}
            style={{
                fontSize: '13px',
                padding: '8px 12px',
                whiteSpace: 'nowrap'
            }}
        >
            {icon}
            {label}
            <ChevronDown size={14} style={{ opacity: 0.5 }} />

            {/* Invisible Select Overlay for Simplicity */}
            <select
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => onChange(e.target.value)}
                value=""
            >
                <option value="">Sort/Filter</option>
                {/* Option to clear */}
                <option value="">All</option>
                {options && options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </button>
    </div>
);

export default FilterBar;
