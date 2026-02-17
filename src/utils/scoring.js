export const calculateMatchScore = (job, prefs) => {
    if (!prefs) return 0;

    let score = 0;
    const {
        roleKeywords = '',
        preferredLocations = [], // Expecting array of strings
        preferredMode = [],      // Expecting array of strings
        experienceLevel = '',
        skills = '',
        // minMatchScore is used for filtering, not scoring calculation itself
    } = prefs;

    // Helper to normalize strings
    const normalize = (str) => str?.toLowerCase().trim() || '';
    const parseList = (str) => str.split(',').map(normalize).filter(Boolean);

    const jobTitle = normalize(job.title);
    const jobDesc = normalize(job.description);
    const jobLoc = normalize(job.location);
    const jobMode = normalize(job.mode);
    const jobExp = normalize(job.experience);
    const jobSkills = job.skills.map(normalize);
    const jobSource = normalize(job.source);

    // 1. Role Match (+25)
    // Check if ANY keyword matches title
    const keywords = parseList(roleKeywords);
    const titleMatch = keywords.some(k => jobTitle.includes(k));
    if (titleMatch) score += 25;

    // 2. Description Match (+15)
    // Check if ANY keyword matches description
    const descMatch = keywords.some(k => jobDesc.includes(k));
    if (descMatch) score += 15;

    // 3. Location Match (+15)
    // Check if job location is in preferred locations
    // Handle "Remote" matching if location is "Remote"
    const prefLocs = Array.isArray(preferredLocations)
        ? preferredLocations.map(normalize)
        : parseList(preferredLocations); // Fallback if string

    // If user prefers "Remote" and job is "Remote", it matches location too usually, 
    // but strictly checking location field here.
    if (prefLocs.some(l => jobLoc.includes(l) || l.includes(jobLoc))) {
        score += 15;
    }

    // 4. Mode Match (+10)
    // job.mode is usually "Remote", "Onsite", "Hybrid"
    const prefModes = Array.isArray(preferredMode) ? preferredMode.map(normalize) : [];
    if (prefModes.includes(jobMode)) {
        score += 10;
    }

    // 5. Experience Match (+10)
    // Normalize by extracting numbers: "3-5" from "3-5 years" or "3-5y"
    const extractExp = (s) => (s.match(/\d+(?:-\d+)?/) || [])[0];
    const jobExpRange = extractExp(jobExp);
    const prefExpRange = extractExp(normalize(experienceLevel));

    if (jobExpRange && prefExpRange && jobExpRange === prefExpRange) {
        score += 10;
    } else if (!prefExpRange && experienceLevel) {
        // Fallback for non-range text like "Fresher"
        if (jobExp.includes(normalize(experienceLevel))) score += 10;
    }


    // 6. Skill Match (+15)
    // Overlap check
    const userSkills = parseList(skills);
    const hasSkillOverlap = userSkills.some(us => jobSkills.some(js => js.includes(us) || us.includes(js)));
    if (hasSkillOverlap) score += 15;

    // 7. Freshness (+5) & 8. Source (+5)
    // Only apply bonuses if there is some relevance (score > 0)
    if (score > 0) {
        if (job.postedDaysAgo <= 2) {
            score += 5;
        }
        if (jobSource.includes('linkedin')) {
            score += 5;
        }
    }

    // Cap at 100
    return Math.min(score, 100);
};

export const getScoreColor = (score) => {
    if (score >= 80) return 'var(--color-success, #4A7A5E)'; // Green
    if (score >= 60) return 'var(--color-warning, #B58900)'; // Amber
    if (score >= 40) return 'var(--color-text-secondary, #666666)'; // Neutral
    return 'var(--color-text-tertiary, #999999)'; // Grey
};

export const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
}
