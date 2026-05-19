"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

  return (
    <section id="certs">
      <SectionHeader title={content.sections.certifications} />
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
                {cert.status === "in-progress" ? content.certificationStatus.inProgress : content.certificationStatus.completed}
              </span>
              <span className="cc-date">{content.certificationDate}</span>
            </div>
            {typeof cert.progress === "number" && (
              <div className="progress">
                <div className="progress-row">
                  <span>{content.ui.progress}</span>
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
          <div>{content.ui.nextCert}</div>
        </article>
      </div>
      <div className="courses">
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

function MobileHeader({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const content = localizedContent[locale];

  return (
    <div className="m-header">
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
  );
}

function BottomNav({ locale }: { locale: Locale }) {
  const icons = ["◆", "▦", "↓", "◎"];
  const content = localizedContent[locale];

  return (
    <nav className="m-nav" aria-label="Mobile sections">
      {content.mobileNavigation.map((item, index) => (
        <a className={`m-nav-item ${item.tone ?? ""}`} href={item.href} key={item.label}>
          <span className="m-nav-icon">{icons[index]}</span>
          {item.label}
        </a>
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
        <BottomNav locale={locale} />
      </div>
    </main>
  );
}
