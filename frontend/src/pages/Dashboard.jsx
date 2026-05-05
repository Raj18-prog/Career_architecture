import { useEffect, useState } from "react";
import api from "../api/axios.js";
import SkillCard from "../components/SkillCard.jsx";
import UploadResume from "../components/UploadResume.jsx";

const courseLinksForSkill = (skill) => {
  const encodedSkill = encodeURIComponent(skill);

  return [
    {
      label: "Coursera",
      url: `https://www.coursera.org/search?query=${encodedSkill}`
    },
    {
      label: "freeCodeCamp",
      url: `https://www.freecodecamp.org/search?query=${encodedSkill}`
    },
    {
      label: "Udemy",
      url: `https://www.udemy.com/courses/search/?q=${encodedSkill}`
    }
  ];
};

const normalizeResource = (resource, skill) => {
  if (resource?.url) return resource;

  if (typeof resource === "string" && resource.startsWith("http")) {
    return { label: resource, url: resource };
  }

  return null;
};

const openCourseLink = (event, url) => {
  event.preventDefault();
  const opened = window.open(url, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.href = url;
  }
};

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [roles, setRoles] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      const [resumeResponse, rolesResponse] = await Promise.all([
        api.get("/resume/latest"),
        api.get("/career/roles")
      ]);
      setResume(resumeResponse.data.resume);
      setRoles(rolesResponse.data.roles);
      setTargetRole(rolesResponse.data.roles[0] || "");
    };

    loadInitialData().catch((err) => {
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    });
  }, []);

  const handleResumeUploaded = (uploadedResume) => {
    setResume(uploadedResume);
    setCareer(null);
    setIsResumeUploaded(true);
  };

  const analyze = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/career/analyze", {
        targetRole,
        resumeId: resume?._id || resume?.id
      });
      setCareer(data.career);
    } catch (err) {
      setError(err.response?.data?.message || "Career analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Skill intelligence dashboard</p>
          <h1>Build your next career move from your resume.</h1>
        </div>
        <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </section>

      <section className="workspace-grid">
        <UploadResume onUploaded={handleResumeUploaded} />

        {isResumeUploaded === true ? (
          <article className="panel">
            <h2>Extracted Skills</h2>
            {resume.extractedSkills?.length ? (
              <div className="skill-grid">
                {resume.extractedSkills.map((skill) => (
                  <SkillCard key={skill} skill={skill} />
                ))}
              </div>
            ) : (
              <p className="muted">No known skills were detected in this resume.</p>
            )}
            <button disabled={loading || !targetRole} onClick={analyze} type="button">
              {loading ? "Analyzing..." : "Generate Career Plan"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </article>
        ) : (
          <article className="panel">
            <p className="muted">Upload a resume to see extracted skills.</p>
          </article>
        )}
      </section>

      {career ? (
        <section className="analysis-grid">
          <article className="panel">
            <h2>Matched Skills</h2>
            <div className="skill-grid">
              {career.matchedSkills.map((skill) => (
                <SkillCard key={skill} skill={skill} />
              ))}
            </div>
          </article>

          <article className="panel">
            <h2>Missing Skills</h2>
            <div className="score">{career.priorityScore}% gap priority</div>
            <div className="skill-grid">
              {career.missingSkills.map((skill) => (
                <article className="missing-skill-card" key={skill}>
                  <SkillCard skill={skill} status="missing" />
                  <div className="course-links compact">
                    {courseLinksForSkill(skill).map((resource) => (
                      <a
                        href={resource.url}
                        key={resource.url}
                        onClick={(event) => openCourseLink(event, resource.url)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="panel wide">
            <h2>Learning Path</h2>
            <div className="path-list">
              {career.learningPath.map((item) => (
                <article className="learning-card" key={item.skill}>
                  <SkillCard
                    detail={`${item.estimatedWeeks} week plan - priority ${item.priority}/10`}
                    skill={item.skill}
                    status="priority"
                  />
                  <div className="course-links">
                    {(item.resources || [])
                      .map((resource) => normalizeResource(resource, item.skill))
                      .filter(Boolean)
                      .map((resource) => (
                        <a
                          href={resource.url}
                          key={resource.url}
                          onClick={(event) => openCourseLink(event, resource.url)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {resource.label}
                        </a>
                      ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="panel wide">
            <h2>OpenAI Suggestions</h2>
            <ul className="suggestions">
              {career.aiSuggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </article>
        </section>
      ) : null}
    </main>
  );
}
