import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const fallbackSuggestions = (targetRole, missingSkills) => [
  `Focus first on ${missingSkills.slice(0, 3).join(", ") || "role-specific portfolio depth"} for ${targetRole}.`,
  "Build one portfolio project that combines the highest priority missing skills.",
  "Rewrite resume bullets to show measurable impact, tools used, and business outcome."
];

export const generateCareerSuggestions = async ({ targetRole, extractedSkills, missingSkills }) => {
  if (!client) {
    return fallbackSuggestions(targetRole, missingSkills);
  }

  const prompt = [
    `Target role: ${targetRole}`,
    `Known skills: ${extractedSkills.join(", ") || "None detected"}`,
    `Missing skills: ${missingSkills.join(", ") || "None"}`,
    "Return 3 concise career suggestions as a JSON array of strings."
  ].join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a practical career coach for software and data professionals."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");

    if (jsonStart >= 0 && jsonEnd >= jsonStart) {
      return JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    }

    return content
      .split("\n")
      .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
  } catch (error) {
    console.error("OpenAI suggestion generation failed:", error.message);
    return fallbackSuggestions(targetRole, missingSkills);
  }
};
