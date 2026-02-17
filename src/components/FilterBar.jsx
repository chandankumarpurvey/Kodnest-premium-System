import React from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronDown, SortAsc } from 'lucide-react';
import Button from './Button';

const FilterBar = () => {
    return (
        <div className="filter-bar-container grid gap-4 p-4 mb-6" style={{
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)'
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
                    />
                </div>
                <Button variant="primary">Search</Button>
            </div>

            {/* Bottom Row: Filters */}
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <FilterSelect icon={<MapPin size={16} />} label="Location" />
                <FilterSelect icon={<Briefcase size={16} />} label="Experience" />
                <FilterSelect icon={<Filter size={16} />} label="Mode" />
                <FilterSelect icon={<Filter size={16} />} label="Source" />
                <div style={{ flex: 1 }}></div>
                <FilterSelect icon={<SortAsc size={16} />} label="Latest" alignRight />
            </div>
        </div>
    );
};

const FilterSelect = ({ icon, label, alignRight }) => (
    <button
        className="btn btn-secondary flex items-center gap-2"
        style={{
            fontSize: '13px',
            padding: '8px 12px',
            whiteSpace: 'nowrap',
            marginLeft: alignRight ? 'auto' : 0
        }}
    >
        {icon}
        {label}
        <ChevronDown size={14} style={{ opacity: 0.5 }} />
    </button>
);

export default FilterBar;
