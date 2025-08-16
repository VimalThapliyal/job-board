import { Lead } from "@/types/lead";

export interface LeadScore {
  score: number; // 0-100
  level: "junior" | "mid" | "senior" | "lead";
  price: number;
  reasoning: string[];
}

export function qualifyLead(lead: Lead): LeadScore {
  const reasoning: string[] = [];
  let score = 0;
  let level: "junior" | "mid" | "senior" | "lead" = "junior";
  let price = 50; // Base price

  // Experience scoring
  const experienceYears = extractExperienceYears(lead.experience);
  if (experienceYears >= 5) {
    score += 30;
    level = "senior";
    price = 150;
    reasoning.push("5+ years of experience");
  } else if (experienceYears >= 3) {
    score += 25;
    level = "mid";
    price = 100;
    reasoning.push("3+ years of experience");
  } else if (experienceYears >= 1) {
    score += 20;
    level = "junior";
    price = 50;
    reasoning.push("1+ years of experience");
  } else {
    score += 10;
    level = "junior";
    price = 50;
    reasoning.push("Entry level");
  }

  // Skills scoring
  const skills = extractSkills(lead.experience, lead.coverLetter);
  const reactSkills = skills.filter(skill => 
    skill.toLowerCase().includes('react') ||
    skill.toLowerCase().includes('javascript') ||
    skill.toLowerCase().includes('typescript') ||
    skill.toLowerCase().includes('frontend')
  );

  if (reactSkills.length >= 3) {
    score += 25;
    reasoning.push("Strong React/JavaScript skills");
  } else if (reactSkills.length >= 1) {
    score += 15;
    reasoning.push("Basic React/JavaScript skills");
  }

  // Additional skills scoring
  const advancedSkills = skills.filter(skill =>
    skill.toLowerCase().includes('node') ||
    skill.toLowerCase().includes('next') ||
    skill.toLowerCase().includes('redux') ||
    skill.toLowerCase().includes('graphql') ||
    skill.toLowerCase().includes('aws') ||
    skill.toLowerCase().includes('docker')
  );

  if (advancedSkills.length >= 2) {
    score += 20;
    reasoning.push("Advanced technical skills");
  } else if (advancedSkills.length >= 1) {
    score += 10;
    reasoning.push("Some advanced skills");
  }

  // Communication scoring
  if (lead.coverLetter && lead.coverLetter.length > 100) {
    score += 15;
    reasoning.push("Good communication skills");
  }

  // Resume scoring
  if (lead.resumeUrl && lead.resumeUrl !== "error_uploading") {
    score += 10;
    reasoning.push("Resume provided");
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Adjust price based on score
  if (score >= 80) {
    level = "lead";
    price = 200;
  } else if (score >= 60) {
    level = "senior";
    price = 150;
  } else if (score >= 40) {
    level = "mid";
    price = 100;
  } else {
    level = "junior";
    price = 50;
  }

  return {
    score,
    level,
    price,
    reasoning,
  };
}

function extractExperienceYears(experience: string): number {
  const experienceLower = experience.toLowerCase();
  
  // Look for patterns like "5 years", "3+ years", "2-4 years"
  const yearPatterns = [
    /(\d+)\+?\s*years?/i,
    /(\d+)-(\d+)\s*years?/i,
    /(\d+)\s*years?/i,
  ];

  for (const pattern of yearPatterns) {
    const match = experienceLower.match(pattern);
    if (match) {
      if (match[2]) {
        // Range like "2-4 years"
        return Math.floor((parseInt(match[1]) + parseInt(match[2])) / 2);
      } else {
        return parseInt(match[1]);
      }
    }
  }

  // Look for keywords
  if (experienceLower.includes('senior') || experienceLower.includes('lead')) {
    return 5;
  } else if (experienceLower.includes('mid') || experienceLower.includes('intermediate')) {
    return 3;
  } else if (experienceLower.includes('junior') || experienceLower.includes('entry')) {
    return 1;
  }

  return 1; // Default to 1 year
}

function extractSkills(experience: string, coverLetter: string): string[] {
  const text = `${experience} ${coverLetter}`.toLowerCase();
  const skills: string[] = [];

  // Common React/JavaScript skills
  const skillKeywords = [
    'react', 'javascript', 'typescript', 'node.js', 'next.js',
    'redux', 'context', 'hooks', 'jsx', 'es6', 'es7',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
    'git', 'github', 'docker', 'aws', 'azure', 'firebase',
    'graphql', 'rest', 'api', 'mongodb', 'postgresql', 'mysql',
    'jest', 'testing', 'cypress', 'webpack', 'babel', 'vite'
  ];

  for (const skill of skillKeywords) {
    if (text.includes(skill)) {
      skills.push(skill);
    }
  }

  return skills;
}

export function getLeadPrice(score: number): number {
  if (score >= 80) return 200; // Lead level
  if (score >= 60) return 150; // Senior level
  if (score >= 40) return 100; // Mid level
  return 50; // Junior level
}

export function getLeadLevel(score: number): "junior" | "mid" | "senior" | "lead" {
  if (score >= 80) return "lead";
  if (score >= 60) return "senior";
  if (score >= 40) return "mid";
  return "junior";
} 