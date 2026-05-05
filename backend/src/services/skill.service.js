import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeSkill, normalizeText } from "../utils/tokenizer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobSkillsPath = path.join(__dirname, "../data/jobSkills.json");
const jobSkills = JSON.parse(fs.readFileSync(jobSkillsPath, "utf8"));

const knownSkills = Array.from(
  new Set(
    Object.values(jobSkills)
      .flatMap((role) => role.requiredSkills)
      .concat([
        "AWS",
        "Azure",
        "CI/CD",
        "GraphQL",
        "Next.js",
        "PostgreSQL",
        "Tailwind CSS",
        "Figma",
        "Agile",
        "Scrum"
      ])
  )
);

export const getAvailableRoles = () => Object.keys(jobSkills);

export const extractSkillsFromText = (resumeText) => {
  const normalizedResume = normalizeText(resumeText);

  return knownSkills
    .filter((skill) => normalizedResume.includes(normalizeSkill(skill)))
    .sort((a, b) => a.localeCompare(b));
};

export const compareSkillsForRole = (candidateSkills, targetRole) => {
  const role = jobSkills[targetRole];

  if (!role) {
    const error = new Error(`Unknown target role: ${targetRole}`);
    error.statusCode = 400;
    throw error;
  }

  const candidateSet = new Set(candidateSkills.map(normalizeSkill));
  const matchedSkills = role.requiredSkills.filter((skill) => candidateSet.has(normalizeSkill(skill)));
  const missingSkills = role.requiredSkills.filter((skill) => !candidateSet.has(normalizeSkill(skill)));
  const totalWeight = role.requiredSkills.reduce((sum, skill) => sum + (role.weights[skill] || 1), 0);
  const missingWeight = missingSkills.reduce((sum, skill) => sum + (role.weights[skill] || 1), 0);
  const priorityScore = Math.round((missingWeight / totalWeight) * 100);

  return {
    matchedSkills,
    missingSkills,
    priorityScore,
    weights: role.weights
  };
};

const buildCourseLinks = (skill) => {
  const encodedSkill = encodeURIComponent(skill);

  return [
    {
      label: `${skill} on Coursera`,
      url: `https://www.coursera.org/search?query=${encodedSkill}`
    },
    {
      label: `${skill} on freeCodeCamp`,
      url: `https://www.freecodecamp.org/search?query=${encodedSkill}`
    },
    {
      label: `${skill} on Udemy`,
      url: `https://www.udemy.com/courses/search/?q=${encodedSkill}`
    }
  ];
};

export const buildLearningPath = (missingSkills, weights = {}) =>
  missingSkills
    .map((skill) => {
      const priority = weights[skill] || 1;

      return {
        skill,
        priority,
        reason: `${skill} is important for the selected role and is currently missing from the resume.`,
        resources: buildCourseLinks(skill),
        estimatedWeeks: priority >= 8 ? 3 : priority >= 6 ? 2 : 1
      };
    })
    .sort((a, b) => b.priority - a.priority);
