import Link from "next/link";
import {
  certifications,
  courses,
  demos,
  heroContent,
  mobileNavigation,
  navigation,
  profile,
  projects,
  suggestions,
  uiText
} from "@/lib/data";

function BrowserBar() {
  return (
    <div className="browser-bar">
      <div className="dots" aria-hidden="true">
        <div className="dot" style={{ background: "#ff5f57" }} />
        <div className="dot" style={{ background: "#febc2e" }} />
        <div className="dot" style={{ background: "#28c840" }} />
      </div>
      <div className="url">
        <span aria-hidden="true">lock</span>
        <span>{profile.url}</span>
      </div>
      <div className="vercel-mark">{uiText.browserProvider}</div>
    </div>
  );
}

function LanguageToggle({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "m-lang" : "lang"} aria-label="Language selector">
      <div className={mobile ? "mlb on" : "lb on"}>{uiText.language.primary}</div>
      <div className={mobile ? "mlb" : "lb"}>{uiText.language.secondary}</div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="avatar">{profile.initials}</div>
        <div className="p-name">{profile.name}</div>
        <div className="p-role">{profile.role}</div>
      </div>

      <div>
        <div className="slabel">{uiText.openToLabel}</div>
        <div className="open-list">
          {profile.openTo.map((item) => (
            <div className="open-item" key={item}>
              <span className="open-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="slabel">{uiText.navigateLabel}</div>
        <nav className="nav" aria-label="Portfolio sections">
          {navigation.map((item) => (
            <a className={`nav-item ${item.tone ?? ""}`} href={item.href} key={item.label}>
              <span className="nav-dot" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div>
        <div className="slabel">{uiText.stackLabel}</div>
        <div className="tags">
          {profile.stack.map((tag, index) => (
            <span className={index < 3 ? "tag hi" : "tag"} key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="status-line">
        <div className="pulse" />
        <div>{uiText.statusLine}</div>
      </div>
    </aside>
  );
}

function SectionHeader({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <span className="section-link">
        {compact ? uiText.sectionLinks.compact : uiText.sectionLinks.full}
      </span>
    </div>
  );
}

function Hero({ mobile = false }: { mobile?: boolean }) {
  return (
    <section className={mobile ? "hero mobile-spacer" : "hero"} id="chat">
      <div className="hero-ey">{heroContent.eyebrow}</div>
      <h1 className="hero-h">
        {heroContent.titlePrefix}<em>{heroContent.titleAccent}</em>
        {!mobile && <><br />{heroContent.titleSuffix}</>}
      </h1>
      <p className="hero-p">{heroContent.description}</p>
      <div className={mobile ? "mobile-sugs" : "sugs"}>
        {suggestions.map((suggestion, index) => (
          <div className={mobile ? "sug mobile-sug" : "sug"} key={suggestion.text}>
            {mobile && <div className="mobile-icon">{index + 1}</div>}
            <div>
              <div className="sug-l">{suggestion.label}</div>
              <div className="sug-t">{suggestion.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects">
      <SectionHeader title="Projects" />
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <h3 className="project-title">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tags">
              {project.stack.map((tag, index) => (
                <span className={index === 0 ? "tag hi" : "tag"} key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection() {
  const cert = certifications[0];

  return (
    <section id="certs">
      <SectionHeader title="Certifications & Courses" />
      <div className="cert-grid">
        <article className="cc featured">
          <div className="cc-in">
            <div className="cc-top">
              <div className="cc-logo">AWS</div>
              <div className="cc-iss">{cert.issuer}</div>
            </div>
            <h3 className="cc-name">{cert.name}</h3>
            <div className="cc-meta">
              <span className="badge b-amber">
                {cert.status === "in-progress" ? "In progress" : "Completed"}
              </span>
              <span className="cc-date">{cert.date}</span>
            </div>
            {typeof cert.progress === "number" && (
              <div className="progress">
                <div className="progress-row">
                  <span>Progress</span>
                  <strong>{cert.progress}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${cert.progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </article>
        <article className="cc empty-card">
          <div className="empty-plus">+</div>
          <div>Next cert<br />coming soon</div>
        </article>
      </div>
      <div className="courses">
        <div className="course-label">Courses</div>
        {courses.map((course) => (
          <article className="course-card" key={course.name}>
            <div className={`course-dot ${course.accent}`} />
            <div>
              <h3 className="course-name">{course.name}</h3>
              <div className="course-platform">{course.platform}</div>
              <div className="co-tags">
                <span className={`badge b-${course.accent}`}>{course.status}</span>
                {course.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LiveDemosSection() {
  return (
    <section id="demos">
      <SectionHeader title="Live Demos" />
      <div className="demo-strip">
        {demos.map((demo) => {
          const content = (
            <>
              <div className="dc-tag">{demo.category}</div>
              <h3 className="dc-title">{demo.title}</h3>
              <div className="dc-sub">{demo.description}</div>
              <div className="dc-tags">
                {demo.tags.map((tag, index) => (
                  <span className={index === 0 ? "tag hi" : "tag"} key={tag}>{tag}</span>
                ))}
              </div>
            </>
          );

          return demo.disabled ? (
            <article className="demo-card disabled" key={demo.title}>{content}</article>
          ) : (
            <Link className="demo-card" href={demo.href} key={demo.title}>{content}</Link>
          );
        })}
      </div>
    </section>
  );
}

function MobileHeader() {
  return (
    <div className="m-header">
      <div className="m-profile">
        <div className="m-avatar">{profile.initials}</div>
        <div>
          <div className="m-name">{profile.name}</div>
          <div className="m-role">{profile.role}</div>
        </div>
      </div>
      <div className="m-actions">
        <div className="ai-on"><div className="pulse" />{uiText.aiStatus}</div>
        <LanguageToggle mobile />
      </div>
    </div>
  );
}

function MobileDemosSection() {
  return (
    <section className="mobile-spacer">
      <SectionHeader title="Live Demos" compact />
      <div className="demo-strip">
        {demos.map((demo, index) => (
          <Link
            aria-disabled={demo.disabled}
            className={demo.disabled ? "demo-card disabled" : "demo-card"}
            href={demo.href}
            key={demo.title}
          >
            <div className="mobile-sug">
              <div className="m-demo-icon">{index + 1}</div>
              <div>
                <h3 className="dc-title">{demo.title}</h3>
                <div className="dc-sub">{demo.category} · {demo.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MobileInput() {
  return (
    <div className="m-input-wrap">
      <div className="m-input-row">
        <input className="m-input" placeholder="Ask me anything..." readOnly />
        <button className="m-send" aria-label="Send message" type="button">↑</button>
      </div>
    </div>
  );
}

function BottomNav() {
  const icons = ["◆", "▦", "↓", "◎"];

  return (
    <nav className="m-nav" aria-label="Mobile sections">
      {mobileNavigation.map((item, index) => (
        <a className={`m-nav-item ${item.tone ?? ""}`} href={item.href} key={item.label}>
          <span className="m-nav-icon">{icons[index]}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default function Home() {
  return (
    <main className="page-shell">
      <div className="browser">
        <BrowserBar />

        <div className="desktop-layout">
          <Sidebar />
          <div className="main-d">
            <div className="topbar">
              <div>
                <div className="tbar-title">{uiText.portfolioTitle}</div>
                <div className="tbar-sub">{profile.headline}</div>
              </div>
              <LanguageToggle />
            </div>
            <div className="scroll">
              <Hero />
              <ProjectsSection />
              <CertificationsSection />
              <LiveDemosSection />
            </div>
          </div>
        </div>

        <div className="mobile-layout">
          <MobileHeader />
          <div className="m-scroll">
            <Hero mobile />
            <ProjectsSection />
            <CertificationsSection />
            <MobileDemosSection />
          </div>
          <MobileInput />
          <BottomNav />
        </div>
      </div>
    </main>
  );
}
