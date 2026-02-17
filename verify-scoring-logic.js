import { calculateMatchScore } from './src/utils/scoring.js';

console.log('Starting Scoring Logic Verification...');

const mockJob = {
    title: 'Senior React Developer',
    description: 'We need a React expert with Node.js skills.',
    location: 'Bangalore',
    mode: 'Hybrid',
    experience: '3-5 years',
    skills: ['React', 'Node.js', 'TypeScript'],
    source: 'LinkedIn',
    postedDaysAgo: 1
};

const prefsMixed = {
    roleKeywords: 'React, Frontend',
    preferredLocations: 'Bangalore, Pune',
    preferredMode: ['Hybrid'],
    experienceLevel: '3-5y',
    skills: 'React, CSS',
    minMatchScore: 40
};

// Expected Score Calculation:
// Role Match (React): +25
// Desc Match (React): +15
// Location (Bangalore): +15
// Mode (Hybrid): +10
// Exp (3-5y matches 3-5 years): +10
// Skills (React): +15
// Freshness (<2 days): +5
// Source (LinkedIn): +5
// Total: 100

try {
    const score = calculateMatchScore(mockJob, prefsMixed);
    console.log(`Calculated Score: ${score}`);

    if (score === 100) {
        console.log('✅ Perfect Match Scored 100 correctly.');
    } else {
        console.error(`❌ Expected 100, got ${score}`);
        process.exit(1);
    }

    // Test No Match
    const prefsMismatch = {
        roleKeywords: 'Java',
        preferredLocations: 'Delhi',
        preferredMode: ['Onsite'],
        experienceLevel: '0-1y',
        skills: 'Java',
        minMatchScore: 40
    };

    // Freshness (+5) and Source (+5) might still apply if job unchanged
    // Job is Fresh (1 day) + LinkedIn = 10 points minimum base

    const scoreMismatch = calculateMatchScore(mockJob, prefsMismatch);
    console.log(`Mismatch Score: ${scoreMismatch}`);

    if (scoreMismatch === 10) {
        console.log('✅ Mismatch correctly scored 10 (Base Freshness/Source only).');
    } else {
        console.error(`❌ Expected 10, got ${scoreMismatch}`);
        process.exit(1);
    }

    console.log('\n✨ SCORING LOGIC VERIFIED ✨');
    process.exit(0);

} catch (error) {
    console.error('❌ Scoring Verification Failed:', error);
    process.exit(1);
}
