export const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokenize = (value = "") =>
  normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1);

export const normalizeSkill = (skill = "") => normalizeText(skill).replace(/\s+/g, " ");
