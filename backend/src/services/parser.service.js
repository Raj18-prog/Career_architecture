import mammoth from "mammoth";
import pdf from "pdf-parse";

export const parsePdfBuffer = async (buffer) => {
  const parsed = await pdf(buffer);
  return parsed.text?.replace(/\s+/g, " ").trim() || "";
};

export const parseDocxBuffer = async (buffer) => {
  const parsed = await mammoth.extractRawText({ buffer });
  return parsed.value?.replace(/\s+/g, " ").trim() || "";
};

export const parseResumeFile = async (file) => {
  if (file.mimetype === "application/pdf") {
    return parsePdfBuffer(file.buffer);
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return parseDocxBuffer(file.buffer);
  }

  const error = new Error("Only PDF and DOCX resume files are supported.");
  error.statusCode = 415;
  throw error;
};
