import { CheckCircle2, CircleAlert, TrendingUp } from "lucide-react";

const statusIcon = {
  matched: CheckCircle2,
  missing: CircleAlert,
  priority: TrendingUp
};

export default function SkillCard({ skill, status = "matched", detail }) {
  const Icon = statusIcon[status] || CheckCircle2;

  return (
    <article className={`skill-card ${status}`}>
      <Icon size={20} />
      <div>
        <h3>{skill}</h3>
        {detail ? <p>{detail}</p> : null}
      </div>
    </article>
  );
}
