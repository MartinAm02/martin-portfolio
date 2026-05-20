import type { DemoImpactContent, ImpactAudience } from "@/lib/demoPrompts";

const audienceOrder: ImpactAudience[] = ["recruiters", "dataLeaders", "technicalTeams", "business"];

export function DemoImpact({ content }: { content: DemoImpactContent }) {
  return (
    <section className="tool-panel demo-impact">
      <h2 className="pipeline-section-title">{content.title}</h2>
      <div className="demo-impact-grid">
        {audienceOrder.map((audience) => (
          <article className="demo-impact-card" key={audience}>
            <h3>{content.cards[audience].title}</h3>
            <p>{content.cards[audience].text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
