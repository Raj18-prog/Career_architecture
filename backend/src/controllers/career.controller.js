import Career from "../models/career.model.js";
import Resume from "../models/resume.model.js";
import { generateCareerSuggestions } from "../services/ai.service.js";
import {
  buildLearningPath,
  compareSkillsForRole,
  getAvailableRoles
} from "../services/skill.service.js";

export const getRoles = (_req, res) => {
  res.json({ roles: getAvailableRoles() });
};

export const analyzeCareer = async (req, res, next) => {
  try {
    const { targetRole, resumeId } = req.body;

    if (!targetRole) {
      const error = new Error("targetRole is required");
      error.statusCode = 400;
      throw error;
    }

    const resumeQuery = resumeId
      ? { _id: resumeId, user: req.user._id }
      : { user: req.user._id };

    const resume = await Resume.findOne(resumeQuery).sort({ createdAt: -1 });

    if (!resume) {
      const error = new Error("Upload a resume before creating a career plan");
      error.statusCode = 404;
      throw error;
    }

    const comparison = compareSkillsForRole(resume.extractedSkills, targetRole);
    const learningPath = buildLearningPath(comparison.missingSkills, comparison.weights);
    const aiSuggestions = await generateCareerSuggestions({
      targetRole,
      extractedSkills: resume.extractedSkills,
      missingSkills: comparison.missingSkills
    });

    const career = await Career.create({
      user: req.user._id,
      resume: resume._id,
      targetRole,
      matchedSkills: comparison.matchedSkills,
      missingSkills: comparison.missingSkills,
      priorityScore: comparison.priorityScore,
      learningPath,
      aiSuggestions
    });

    res.status(201).json({ career });
  } catch (error) {
    next(error);
  }
};

export const getCareerPlans = async (req, res, next) => {
  try {
    const plans = await Career.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (error) {
    next(error);
  }
};
