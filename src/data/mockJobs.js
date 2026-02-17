const companies = [
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant',
    'IBM', 'Oracle', 'SAP', 'Dell', 'Amazon', 'Flipkart', 'Swiggy',
    'Razorpay', 'PhonePe', 'Paytm', 'Zoho', 'Freshworks', 'Juspay', 'CRED',
    'Urban Company', 'Meesho', 'Zomato', 'Ola', 'Groww', 'Zerodha', 'Postman', 'BrowserStack'
];

const roles = [
    { title: 'SDE Intern', exp: 'Fresher', salary: '₹15k–₹40k/month', skills: ['Java', 'DSA', 'Problem Solving'] },
    { title: 'Graduate Engineer Trainee', exp: 'Fresher', salary: '3–5 LPA', skills: ['C++', 'SQL', 'Basics of Web'] },
    { title: 'Junior Backend Developer', exp: '0-1', salary: '6–10 LPA', skills: ['Node.js', 'Express', 'MongoDB'] },
    { title: 'Frontend Intern', exp: 'Fresher', salary: '₹15k–₹30k/month', skills: ['React', 'HTML/CSS', 'JavaScript'] },
    { title: 'QA Intern', exp: 'Fresher', salary: '₹10k–₹20k/month', skills: ['Manual Testing', 'Selenium', 'Java'] },
    { title: 'Data Analyst Intern', exp: 'Fresher', salary: '₹20k–₹40k/month', skills: ['Python', 'SQL', 'Excel'] },
    { title: 'Java Developer', exp: '0-1', salary: '5–8 LPA', skills: ['Java', 'Spring Boot', 'Hibernate'] },
    { title: 'Python Developer', exp: 'Fresher', salary: '4–7 LPA', skills: ['Python', 'Django', 'Flask'] },
    { title: 'React Developer', exp: '1-3', salary: '8–14 LPA', skills: ['React', 'Redux', 'TypeScript', 'Tailwind'] },
    { title: 'Full Stack Engineer', exp: '1-3', salary: '12–18 LPA', skills: ['MERN Stack', 'AWS', 'System Design'] }
];

const locations = ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida', 'Mumbai', 'Remote'];
const modes = ['On-site', 'Hybrid', 'Remote'];
const sources = ['LinkedIn', 'Naukri', 'Indeed', 'Instahyre', 'Wellfound'];

const descriptions = [
    "We are looking for a passionate individual to join our engineering team. You will be working on high-scale distributed systems.",
    "Great opportunity for freshers to kickstart their career in a fast-paced environment. Strong problem-solving skills required.",
    "Join our dynamic team to build the next generation of fintech products. Experience with modern web technologies is a plus.",
    "We are hiring! Work on cutting-edge AI/ML projects and contribute to our core platform infrastructure.",
    "Looking for a self-starter who loves coding and building user-centric applications. Competitive salary and perks included."
];

const generateJobs = (count) => {
    const jobs = [];
    for (let i = 1; i <= count; i++) {
        // Deterministic Selection based on ID
        const company = companies[i % companies.length];
        const role = roles[i % roles.length];
        const location = locations[i % locations.length];
        const mode = modes[i % modes.length];
        const source = sources[i % sources.length];
        const desc = descriptions[i % descriptions.length];
        // Deterministic daysAgo (pseudo-random looking but fixed)
        const daysAgo = (i * 7) % 10;

        jobs.push({
            id: i,
            title: role.title,
            company: company,
            location: location,
            mode: mode,
            experience: role.exp,
            skills: role.skills,
            source: source,
            postedDaysAgo: daysAgo,
            salaryRange: role.salary,
            applyUrl: `https://www.${company.toLowerCase().replace(/\s/g, '')}.com/careers`,
            description: desc
        });
    }
    return jobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo); // Sort by latest
};

export const jobs = generateJobs(60);
