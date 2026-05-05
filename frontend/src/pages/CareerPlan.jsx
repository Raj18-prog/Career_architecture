import { useEffect, useState } from "react";
import api from "../api/axios.js";

const openCourseLink = (event, url) => {
  event.preventDefault();
  const opened = window.open(url, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.href = url;
  }
};

export default function CareerPlan() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/career/plans")
      .then(({ data }) => setPlans(data.plans))
      .catch((err) => setError(err.response?.data?.message || "Unable to load plans."));
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard-header compact">
        <div>
          <p className="eyebrow">Saved analysis</p>
          <h1>Career Plans</h1>
        </div>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section className="plan-list">
        {plans.map((plan) => (
          <article className="panel" key={plan._id}>
            <div className="plan-heading">
              <h2>{plan.targetRole}</h2>
              <span>{plan.priorityScore}% gap priority</span>
            </div>
            <p className="muted">
              Missing: {plan.missingSkills.length ? plan.missingSkills.join(", ") : "No required skills missing"}
            </p>
            <ol className="timeline">
              {plan.learningPath.slice(0, 5).map((item) => (
                <li key={item.skill}>
                  <strong>{item.skill}</strong>
                  <span>{item.estimatedWeeks} week focus</span>
                  {item.resources?.[0]?.url ? (
                    <a
                      href={item.resources[0].url}
                      onClick={(event) => openCourseLink(event, item.resources[0].url)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Course
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      {!plans.length && !error ? <p className="muted">No career plans yet.</p> : null}
    </main>
  );
}
