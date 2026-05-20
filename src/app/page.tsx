"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { ThemeControls } from "@/components/ThemeControls";
import {
  certifications,
  localizedContent,
  type Locale,
  profile
} from "@/lib/data";

function ProfileAvatar({ className }: { className: "avatar" | "m-avatar" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={className}>
      {!failed && (
        <Image
          alt=""
          className="avatar-image"
          fill
          sizes={className === "avatar" ? "52px" : "34px"}
          onError={() => setFailed(true)}
          src={profile.photoUrl}
        />
      )}
      <span className="avatar-fallback">{profile.initials}</span>
    </div>
  );
}

function Sidebar({ locale }: { locale: Locale }) {
  const content = localizedContent[locale];

  return (
    <aside className="sidebar">
      <div>
        <ProfileAvatar className="avatar" />
        <div className="p-name">{content.profileName}</div>
        <div className="p-role">{content.profileRole}</div>
      </div>

      <div>
        <div className="slabel">{content.ui.navigateLabel}</div>
        <nav className="nav" aria-label="Portfolio sections">
          {content.navigation.map((item) => (
            <a className={`nav-item ${item.tone ?? ""}`} href={item.href} key={item.label}>
              <span className="nav-dot" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div>
        <div className="slabel">{content.contactLabels.contact}</div>
        <div className="contact-list">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          <a href={profile.linkedin}>LinkedIn</a>
          <a href={profile.github} rel="noreferrer" target="_blank">GitHub</a>
        </div>
      </div>

      <div>
        <div className="slabel">{content.contactLabels.languages}</div>
        <div className="language-list">
          <span>{content.contactLabels.spanish}</span>
          <span>{content.contactLabels.english}</span>
        </div>
      </div>

      <div>
        <div className="slabel">{content.ui.stackLabel}</div>
        <div className="stack-category-list">
          {content.techCategories.map((category) => (
            <div className="stack-category" key={category.label}>
              <span>{category.label}</span>
              <div className="tags">
                {category.items.map((tag, index) => (
                  <span className={index === 0 ? "tag hi" : "tag"} key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-line">
        <div className="pulse" />
        <div>{content.ui.statusLine}</div>
      </div>
    </aside>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function ProjectsSection({ locale }: { locale: Locale }) {
  const content = localizedContent[locale];

  return (
    <section id="projects">
      <SectionHeader title={content.sections.projects} />
      <div className="project-grid">
        {content.projects.map((project) => (
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

function ExperienceSection({ locale }: { locale: Locale }) {
  const content = localizedContent[locale];

  return (
    <section id="experience">
      <SectionHeader title={content.sections.experience} />
      <div className="experience-grid">
        {content.experience.map((experience) => (
          <article className="experience-card" key={experience.company}>
            <div className="experience-top">
              <h3 className="experience-company">{experience.company}</h3>
              <span className="experience-role">{experience.role}</span>
            </div>
            <p className="experience-area">{experience.area}</p>
            <ul className="experience-list">
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ locale }: { locale: Locale }) {
  const content = localizedContent[locale];
  const cert = certifications[0];
  const certStatus = cert.status === "in-progress" ? content.certificationStatus.inProgress : content.certificationStatus.completed;

  return (
    <section id="certifications">
      <SectionHeader title={content.sections.certifications} />
      <div className="courses">
        <article className="course-card cert-compact">
          <div className="course-dot amber" />
          <div>
            <h3 className="course-name">AWS Cloud Practitioner</h3>
            <div className="course-platform">{cert.issuer}</div>
            <div className="co-tags">
              <span className="badge b-amber">{certStatus}</span>
            </div>
          </div>
        </article>
        <div className="course-label">{content.ui.coursesLabel}</div>
        {content.courses.map((course) => (
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

function LiveDemosSection({ locale, mobile = false }: { locale: Locale; mobile?: boolean }) {
  const content = localizedContent[locale];

  return (
    <section id="demos">
      <SectionHeader title={content.sections.demos} />
      <div className="demo-strip">
        {content.demos.map((demo, index) => {
          const cardContent = mobile ? (
            <div className="mobile-sug">
              <div className="m-demo-icon">{index + 1}</div>
              <div>
                <h3 className="dc-title">{demo.title}</h3>
                <div className="dc-sub">{demo.category} · {demo.description}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="dc-tag">{demo.category}</div>
              <h3 className="dc-title">{demo.title}</h3>
              <div className="dc-sub">{demo.description}</div>
              <div className="dc-tags">
                {demo.tags.map((tag, tagIndex) => (
                  <span className={tagIndex === 0 ? "tag hi" : "tag"} key={tag}>{tag}</span>
                ))}
              </div>
            </>
          );

          return demo.disabled ? (
            <article className="demo-card disabled" key={demo.title}>{cardContent}</article>
          ) : demo.repoUrl ? (
            <article className="demo-card" key={demo.title}>
              <Link href={demo.href}>{cardContent}</Link>
              <div className="demo-card-actions">
                <a className="demo-card-repo" href={demo.repoUrl} rel="noreferrer" target="_blank">
                  GitHub repo
                </a>
              </div>
            </article>
          ) : (
            <Link className="demo-card" href={demo.href} key={demo.title}>{cardContent}</Link>
          );
        })}
      </div>
    </section>
  );
}

function MobileDrawer({
  isOpen,
  locale,
  onClose
}: {
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
}) {
  const content = localizedContent[locale];
  const navItems = [
    { label: "Chat", target: "chat" },
    { label: locale === "es" ? "Experiencia" : "Experience", target: "experience" },
    { label: locale === "es" ? "Proyectos" : "Projects", target: "projects" },
    { label: locale === "es" ? "Demos en vivo" : "Live demos", target: "demos" },
    { label: locale === "es" ? "Certs y cursos" : "Certs & courses", target: "certifications" },
    { label: "Stack", target: "mobile-stack" }
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  function navigate(target: string) {
    if (target === "mobile-stack") {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      scrollToSection(target);
    }
    onClose();
  }

  return (
    <div aria-hidden={!isOpen} className={`mobile-drawer-layer ${isOpen ? "open" : ""}`}>
      <button aria-label="Close menu overlay" className="mobile-drawer-backdrop" onClick={onClose} type="button" />
      <aside aria-label="Mobile profile menu" className="mobile-drawer" role="dialog">
        <div className="mobile-drawer-head">
          <div className="m-profile">
            <ProfileAvatar className="m-avatar" />
            <div>
              <div className="m-name">{content.profileName}</div>
              <div className="m-role">{content.profileRole}</div>
            </div>
          </div>
          <button aria-label="Close menu" className="drawer-close" onClick={onClose} type="button">×</button>
        </div>

        <div className="drawer-section">
          <div className="slabel">{content.contactLabels.contact}</div>
          <div className="contact-list">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={profile.github} rel="noreferrer" target="_blank">GitHub</a>
          </div>
        </div>

        <div className="drawer-section">
          <div className="slabel">{content.ui.navigateLabel}</div>
          <div className="drawer-nav">
            {navItems.map((item) => (
              <button key={item.target} onClick={() => navigate(item.target)} type="button">{item.label}</button>
            ))}
          </div>
        </div>

        <div className="drawer-section">
          <div className="slabel">{content.contactLabels.languages}</div>
          <div className="language-list">
            <span>{content.contactLabels.spanish}</span>
            <span>{content.contactLabels.english}</span>
          </div>
        </div>

        <div className="drawer-section" id="mobile-stack">
          <div className="slabel">{content.ui.stackLabel}</div>
          <div className="stack-category-list">
            {content.techCategories.map((category) => (
              <div className="stack-category" key={category.label}>
                <span>{category.label}</span>
                <div className="tags">
                  {category.items.map((tag, index) => (
                    <span className={index === 0 ? "tag hi" : "tag"} key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function MobileHeader({
  locale,
  setLocale
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const content = localizedContent[locale];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="m-header">
        <button aria-label="Open menu" className="mobile-menu-button" onClick={() => setIsDrawerOpen(true)} type="button">☰</button>
        <div className="m-profile">
          <ProfileAvatar className="m-avatar" />
          <div>
            <div className="m-name">{content.profileName}</div>
            <div className="m-role">{content.profileRole}</div>
          </div>
        </div>
        <div className="m-actions">
          <div className="ai-on"><div className="pulse" />{content.ui.aiStatus}</div>
          <ThemeControls labels={content.ui} locale={locale} mobile setLocale={setLocale} />
        </div>
      </div>
      <MobileDrawer isOpen={isDrawerOpen} locale={locale} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}

function BottomNav() {
  const icons = ["◆", "▦", "↓", "◎"];
  const navItems = [
    { icon: icons[0], label: "Chat", target: "chat", tone: "active" },
    { icon: icons[1], label: "Exp", target: "experience" },
    { icon: icons[2], label: "Demos", target: "demos" },
    { icon: icons[3], label: "Certs", target: "certifications", tone: "cert" }
  ];

  return (
    <nav className="m-nav" aria-label="Mobile sections">
      {navItems.map((item) => (
        <button className={`m-nav-item ${item.tone ?? ""}`} key={item.target} onClick={() => scrollToSection(item.target)} type="button">
          <span className="m-nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("es");
  const content = localizedContent[locale];

  return (
    <main className="page-shell">
      <div className="desktop-layout">
        <Sidebar locale={locale} />
        <div className="main-d">
          <div className="topbar">
            <div>
              <div className="tbar-title">{content.ui.portfolioTitle}</div>
              <div className="tbar-sub">{content.profileHeadline}</div>
            </div>
            <ThemeControls labels={content.ui} locale={locale} setLocale={setLocale} />
          </div>
          <div className="scroll">
            <ChatPanel
              chatContent={content.chat}
              heroContent={content.hero}
              key={`desktop-${locale}`}
              suggestions={content.suggestions}
            />
            <ExperienceSection locale={locale} />
            <ProjectsSection locale={locale} />
            <CertificationsSection locale={locale} />
            <LiveDemosSection locale={locale} />
          </div>
        </div>
      </div>

      <div className="mobile-layout">
        <MobileHeader locale={locale} setLocale={setLocale} />
        <div className="m-scroll">
          <ChatPanel
            chatContent={content.chat}
            heroContent={content.hero}
            key={`mobile-${locale}`}
            mobile
            suggestions={content.suggestions}
          />
          <ExperienceSection locale={locale} />
          <ProjectsSection locale={locale} />
          <CertificationsSection locale={locale} />
          <LiveDemosSection locale={locale} mobile />
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
