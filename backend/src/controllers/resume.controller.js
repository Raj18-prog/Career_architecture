import Resume from "../models/resume.model.js";
import { parseResumeFile } from "../services/parser.service.js";
import { extractSkillsFromText } from "../services/skill.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Resume file is required");
      error.statusCode = 400;
      throw error;
    }

    const text = await parseResumeFile(req.file);

    if (!text) {
      const error = new Error("No readable text found in this file. Try uploading a text-based PDF or DOCX resume.");
      error.statusCode = 422;
      throw error;
    }

    const extractedSkills = extractSkillsFromText(text);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      originalText: text,
      extractedSkills
    });

    res.status(201).json({
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        extractedSkills: resume.extractedSkills,
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({ resume });
  } catch (error) {
    next(error);
  }
};
